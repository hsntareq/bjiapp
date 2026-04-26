import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../common/entities';
import { User } from '../users/user.entity';
import { CreateOrganizationDto, OrganizationType, UpdateOrganizationDto } from './dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Validate hierarchy: each type can only have specific child types
   */
  private validateHierarchy(parentType: string, childType: string): void {
    const allowedChildren = {
      [OrganizationType.CENTRAL]: [OrganizationType.CITY],
      [OrganizationType.CITY]: [OrganizationType.THANA],
      [OrganizationType.THANA]: [OrganizationType.WARD],
      [OrganizationType.WARD]: [OrganizationType.UNIT],
      [OrganizationType.UNIT]: [], // UNIT cannot have children
    };

    if (!allowedChildren[parentType]?.includes(childType)) {
      throw new BadRequestException(
        `A ${parentType} organization cannot have a ${childType} as a child. Allowed children: ${allowedChildren[parentType]?.join(', ') || 'none'}`,
      );
    }
  }

  /**
   * Create a new organization
   */
  async create(createOrgDto: CreateOrganizationDto): Promise<Organization> {
    // Validate that organization name is unique
    const existing = await this.orgRepository.findOne({
      where: { name: createOrgDto.name },
    });
    if (existing) {
      throw new BadRequestException(`Organization with name "${createOrgDto.name}" already exists`);
    }

    // If parentId is provided, validate the hierarchy
    if (createOrgDto.parentId) {
      const parent = await this.orgRepository.findOne({
        where: { id: createOrgDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent organization with ID ${createOrgDto.parentId} not found`,
        );
      }

      // Validate hierarchy rules
      this.validateHierarchy(parent.type, createOrgDto.type);

      // Auto-populate geographic fields from parent
      if (!createOrgDto.division && parent.division) {
        createOrgDto.division = parent.division;
      }
      if (!createOrgDto.city && parent.city) {
        createOrgDto.city = parent.city;
      }
      if (!createOrgDto.thana && parent.thana) {
        createOrgDto.thana = parent.thana;
      }
    }

    const org = new Organization();
    org.name = createOrgDto.name;
    org.type = createOrgDto.type;
    if (createOrgDto.division) org.division = createOrgDto.division;
    if (createOrgDto.city) org.city = createOrgDto.city;
    if (createOrgDto.thana) org.thana = createOrgDto.thana;
    if (createOrgDto.wardNumber) org.wardNumber = createOrgDto.wardNumber;
    if (createOrgDto.unitName) org.unitName = createOrgDto.unitName;
    if (createOrgDto.parentId) org.parentId = createOrgDto.parentId;

    return await this.orgRepository.save(org);
  }

  /**
   * Get all organizations with optional filtering
   */
  async findAll(type?: string): Promise<Organization[]> {
    const query = this.orgRepository.createQueryBuilder('org');

    if (type) {
      query.where('org.type = :type', { type });
    }

    return query
      .leftJoinAndSelect('org.children', 'children')
      .orderBy('org.type', 'ASC')
      .addOrderBy('org.name', 'ASC')
      .getMany();
  }

  /**
   * Get organization by ID with children
   */
  async findById(id: number): Promise<Organization> {
    const org = await this.orgRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return org;
  }

  /**
   * Get full hierarchy tree starting from root
   */
  async getHierarchyTree(userId?: number): Promise<Organization[]> {
    let roots: Organization[] = [];

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (user && user.organizationId) {
        roots = await this.orgRepository.find({
          where: { id: user.organizationId },
          relations: ['children'],
        });
      } else {
        roots = await this.orgRepository.find({
          where: { type: OrganizationType.CENTRAL },
          relations: ['children'],
        });
      }
    } else {
      roots = await this.orgRepository.find({
        where: { type: OrganizationType.CENTRAL },
        relations: ['children'],
      });
    }

    // Recursively load all children
    for (const root of roots) {
      await this.loadChildrenRecursively(root);
    }

    return roots;
  }

  /**
   * Recursively load all children for an organization
   */
  private async loadChildrenRecursively(org: Organization): Promise<void> {
    org.children = await this.orgRepository.find({
      where: { parentId: org.id },
      relations: ['children'],
    });

    for (const child of org.children) {
      await this.loadChildrenRecursively(child);
    }
  }

  /**
   * Get full path from organization to root (ancestors)
   */
  async getWithPath(id: number): Promise<{ org: Organization; path: Organization[] }> {
    const org = await this.findById(id);
    const path: Organization[] = [org];

    let current = org;
    while (current.parentId) {
      const parent = await this.orgRepository.findOne({
        where: { id: current.parentId },
      });
      if (!parent) break;
      path.unshift(parent);
      current = parent;
    }

    return { org, path };
  }

  /**
   * Get all descendants of an organization
   */
  async getDescendants(id: number): Promise<Organization[]> {
    const org = await this.findById(id);

    const descendants: Organization[] = [];
    const stack: Organization[] = [org];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;

      const children = await this.orgRepository.find({
        where: { parentId: current.id },
      });

      descendants.push(...children);
      stack.push(...children);
    }

    return descendants;
  }

  /**
   * Update organization
   */
  async update(id: number, updateOrgDto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.findById(id);

    // Check for name uniqueness if name is being updated
    if (updateOrgDto.name && updateOrgDto.name !== org.name) {
      const existing = await this.orgRepository.findOne({
        where: { name: updateOrgDto.name },
      });
      if (existing) {
        throw new BadRequestException(
          `Organization with name "${updateOrgDto.name}" already exists`,
        );
      }
    }

    Object.assign(org, updateOrgDto);
    return this.orgRepository.save(org);
  }

  /**
   * Delete organization (with cascading considerations)
   */
  async delete(id: number): Promise<void> {
    const org = await this.findById(id);

    // Check if organization has children
    const children = await this.orgRepository.find({
      where: { parentId: id },
    });

    if (children.length > 0) {
      throw new BadRequestException(
        `Cannot delete organization with ${children.length} child organization(s). Please move or delete children first.`,
      );
    }

    await this.orgRepository.remove(org);
  }

  /**
   * Get organizations by type
   */
  async findByType(type: string): Promise<Organization[]> {
    return this.orgRepository.find({
      where: { type },
      order: { name: 'ASC' },
    });
  }

  /**
   * Get children of organization
   */
  async getChildren(id: number): Promise<Organization[]> {
    return this.orgRepository.find({
      where: { parentId: id },
      order: { name: 'ASC' },
    });
  }

  /**
   * Get statistics about organizational structure
   */
  async getStatistics(): Promise<{
    totalOrganizations: number;
    byType: Record<string, number>;
  }> {
    const all = await this.orgRepository.find();
    const byType: Record<string, number> = {};

    for (const org of all) {
      byType[org.type] = (byType[org.type] || 0) + 1;
    }

    return {
      totalOrganizations: all.length,
      byType,
    };
  }

  /**
   * Get all members (users) of an organization
   */
  async getMembers(organizationId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { organizationId },
      relations: ['role'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Get all subordinates (users in org and all descendants)
   */
  async getSubordinates(organizationId: number): Promise<User[]> {
    const org = await this.findById(organizationId);
    const descendants = await this.getDescendants(organizationId);
    const descendantIds = descendants.map((d) => d.id);

    // Get users from this org and all descendants using IN operator
    const allOrgIds = [organizationId, ...descendantIds];

    if (allOrgIds.length === 0) {
      return [];
    }

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.organizationId IN (:...orgIds)', { orgIds: allOrgIds })
      .leftJoinAndSelect('user.role', 'role')
      .orderBy('user.name', 'ASC')
      .getMany();

    return users;
  }

  /**
   * Assign user to organization
   */
  async assignUserToOrg(userId: number, organizationId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const org = await this.findById(organizationId);

    user.organizationId = organizationId;
    user.organization = org;

    return this.userRepository.save(user);
  }

  /**
   * Remove user from organization
   */
  async removeUserFromOrg(userId: number, organizationId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId, organizationId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found in organization ${organizationId}`,
      );
    }

    user.organizationId = null as any;
    await this.userRepository.save(user);
  }

  /**
   * Get team statistics for an organization
   */
  async getTeamStats(organizationId: number): Promise<{
    totalMembers: number;
    totalSubordinates: number;
    directMembers: number;
    activeUsers: number;
    membersByRole: Record<string, number>;
  }> {
    const directMembers = await this.getMembers(organizationId);
    const allSubordinates = await this.getSubordinates(organizationId);

    const stats = {
      totalMembers: directMembers.length,
      totalSubordinates: allSubordinates.length,
      directMembers: directMembers.length,
      activeUsers: directMembers.filter((u) => u.isActive).length,
      membersByRole: {} as Record<string, number>,
    };

    // Count by role
    for (const user of directMembers) {
      const roleName = user.role?.name || 'Unassigned';
      stats.membersByRole[roleName] = (stats.membersByRole[roleName] || 0) + 1;
    }

    return stats;
  }
}
