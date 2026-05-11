import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { OrganizationLevel, Organization, Position, OrganizationPositionAssignment } from '../common/entities';
import { User } from '../users/user.entity';

@Injectable()
export class OrgManagementService {
  constructor(
    @InjectRepository(OrganizationLevel)
    private levelRepo: Repository<OrganizationLevel>,
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
    @InjectRepository(Position)
    private positionRepo: Repository<Position>,
    @InjectRepository(OrganizationPositionAssignment)
    private assignmentRepo: Repository<OrganizationPositionAssignment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ==========================================
  // SEEDING
  // ==========================================

  async seedHierarchicalStructure() {
    // 1. Seed Levels
    const levels = [
      { name: 'Central', slug: 'central', code: 'C' },
      { name: 'City / Metropolitan', slug: 'city', code: 'CT' },
      { name: 'Thana', slug: 'thana', code: 'T' },
      { name: 'Ward', slug: 'ward', code: 'W' },
      { name: 'Unit', slug: 'unit', code: 'U' },
    ];

    for (const l of levels) {
      let level = await this.levelRepo.findOne({ where: { slug: l.slug } });
      if (!level) {
        level = this.levelRepo.create(l);
        await this.levelRepo.save(level);
      }
    }

    // 2. Seed Positions for each level
    const levelMap = await this.levelRepo.find();
    const findLevel = (slug: string) => levelMap.find(l => l.slug === slug);

    const positionTemplates: Record<string, string[]> = {
      central: [
        'Ameer', 'Nayeb-e-Ameer', 'Secretary General', 'Assistant Secretary General',
        'Central Executive Member', 'Central Working Committee Member', 'Central Majlish-e-Shura Member',
        'Department Secretary', 'Finance Secretary', 'Publication Secretary', 'Training Secretary',
        'Dawah Secretary', 'Organizational Secretary', 'Women Affairs Secretary', 'Youth Affairs Secretary',
        'Office Secretary', 'Media/Publicity Secretary'
      ],
      city: [
        'City Ameer', 'City Nayeb-e-Ameer', 'City Secretary', 'Assistant City Secretary',
        'City Executive Member', 'City Shura Member', 'City Finance Secretary', 'City Training Secretary',
        'City Dawah Secretary', 'City Organizational Secretary', 'City Office Secretary',
        'City Media Secretary', 'City Women Affairs Secretary', 'City Youth Affairs Secretary'
      ],
      thana: [
        'Thana Ameer', 'Thana Nayeb-e-Ameer', 'Thana Secretary', 'Assistant Thana Secretary',
        'Thana Executive Member', 'Thana Shura Member', 'Thana Finance Secretary', 'Thana Training Secretary',
        'Thana Dawah Secretary', 'Thana Organizational Secretary', 'Thana Office Secretary',
        'Thana Media Secretary', 'Thana Women Affairs Secretary', 'Thana Youth Affairs Secretary'
      ],
      ward: [
        'Ward President / Ameer', 'Ward Vice President', 'Ward Secretary', 'Assistant Ward Secretary',
        'Ward Executive Member', 'Ward Finance Secretary', 'Ward Training Secretary',
        'Ward Dawah Secretary', 'Ward Organizational Secretary', 'Ward Office Secretary',
        'Ward Media Secretary', 'Ward Women Affairs Secretary', 'Ward Youth Affairs Secretary'
      ],
      unit: [
        'Unit President / Ameer', 'Unit Secretary', 'Unit Member', 'Unit Worker',
        'Unit Training Coordinator', 'Unit Dawah Coordinator', 'Unit Finance Coordinator'
      ],
    };

    for (const [levelSlug, posNames] of Object.entries(positionTemplates)) {
      const level = findLevel(levelSlug);
      if (!level) continue;

      for (let i = 0; i < posNames.length; i++) {
        const name = posNames[i];
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        let pos = await this.positionRepo.findOne({ 
          where: { organizationLevelId: level.id, slug } 
        });

        if (!pos) {
          pos = this.positionRepo.create({
            organizationLevelId: level.id,
            name,
            slug,
            rankOrder: i + 1,
            isExecutive: i < 5 // First 5 are usually executive
          });
          await this.positionRepo.save(pos);
        }
      }
    }
  }

  // ==========================================
  // ORGANIZATIONS
  // ==========================================

  async createOrganization(data: {
    name: string;
    bnName?: string;
    slug?: string;
    code?: string;
    parentId?: number;
    organizationLevelId?: number;
    type?: string;
  }) {
    // Resolve organizationLevelId from type string if provided
    if (data.type && !data.organizationLevelId) {
      const level = await this.levelRepo.findOne({ where: { slug: data.type.toLowerCase() } });
      if (level) {
        data.organizationLevelId = level.id;
      }
    }

    if (!data.organizationLevelId) {
      throw new BadRequestException('Organization level is required');
    }

    // Validate hierarchy
    if (data.parentId) {
      const parent = await this.orgRepo.findOne({ 
        where: { id: data.parentId },
        relations: ['level']
      });
      if (!parent) throw new NotFoundException('Parent organization not found');

      const targetLevel = await this.levelRepo.findOne({ where: { id: data.organizationLevelId } });
      if (!targetLevel) throw new NotFoundException('Organization level not found');

      // Simple hierarchy check: Central(1) < City(2) < Thana(3) < Ward(4) < Unit(5)
      if (targetLevel.id <= parent.organizationLevelId) {
        throw new BadRequestException('Invalid hierarchy: Child level must be lower than parent level');
      }
    }

    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const org = this.orgRepo.create(data);
    return this.orgRepo.save(org);
  }

  async updateOrganization(id: number, data: any) {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');

    if (data.name && data.name !== org.name) {
      org.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    Object.assign(org, data);
    return this.orgRepo.save(org);
  }

  async deleteOrganization(id: number) {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');

    // Check for children
    const childrenCount = await this.orgRepo.count({ where: { parentId: id } });
    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete organization with sub-organizations. Delete them first.');
    }

    await this.orgRepo.remove(org);
    return { success: true };
  }

  async getOrganizationTree(rootId?: number) {
    if (rootId) {
      const root = await this.orgRepo.findOne({
        where: { id: rootId },
        relations: ['level'],
      });
      if (!root) return [];
      return [await this.buildTree(root)];
    }

    const roots = await this.orgRepo.find({
      where: { parentId: IsNull() },
      relations: ['level'],
    });

    const tree: any[] = [];
    for (const root of roots) {
      tree.push(await this.buildTree(root));
    }
    return tree;
  }

  private async buildTree(org: Organization): Promise<any> {
    const children = await this.orgRepo.find({
      where: { parentId: org.id },
      relations: ['level'],
    });

    const childrenTree: any[] = [];
    for (const child of children) {
      childrenTree.push(await this.buildTree(child));
    }

    // Calculate real personnel strength (recursive)
    const stats = await this.calculateRecursiveStats(org.id);

    return {
      ...org,
      type: org.level?.slug?.toUpperCase(),
      demoMembers: stats.members, 
      activists: stats.activists,
      associates: stats.associates,
      children: childrenTree,
    };
  }

  private async calculateRecursiveStats(orgId: number): Promise<{ members: number; activists: number; associates: number }> {
    const directMembers = await this.userRepo.count({ where: { organizationId: orgId, rank: 'member' } });
    const directActivists = await this.userRepo.count({ where: { organizationId: orgId, rank: 'activist' } });
    const directAssociates = await this.userRepo.count({ where: { organizationId: orgId, rank: 'associate' } });

    let totalMembers = directMembers;
    let totalActivists = directActivists;
    let totalAssociates = directAssociates;

    const children = await this.orgRepo.find({ where: { parentId: orgId } });
    for (const child of children) {
      const childStats = await this.calculateRecursiveStats(child.id);
      totalMembers += childStats.members;
      totalActivists += childStats.activists;
      totalAssociates += childStats.associates;
    }

    return {
      members: totalMembers,
      activists: totalActivists,
      associates: totalAssociates,
    };
  }

  // ==========================================
  // POSITIONS & ASSIGNMENTS
  // ==========================================

  async createPosition(data: {
    name: string;
    bnName?: string;
    organizationLevelId: number;
    rankOrder?: number;
    isExecutive?: boolean;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const position = this.positionRepo.create({
      ...data,
      slug,
    });
    return this.positionRepo.save(position);
  }

  async getPositionsByLevel(levelId: number) {
    return this.positionRepo.find({
      where: { organizationLevelId: levelId },
      order: { rankOrder: 'ASC' }
    });
  }

  async assignPosition(data: {
    organizationId: number;
    positionId: number;
    userId: number;
    assignedBy: number;
  }) {
    const org = await this.orgRepo.findOne({ where: { id: data.organizationId } });
    if (!org) throw new NotFoundException('Organization not found');

    const pos = await this.positionRepo.findOne({ where: { id: data.positionId } });
    if (!pos) throw new NotFoundException('Position not found');

    // STRICT ISOLATION: Position must belong to the organization's level
    if (pos.organizationLevelId !== org.organizationLevelId) {
      throw new BadRequestException('Position isolation violation: This position is not allowed for this organization level');
    }

    // Check for existing active assignment
    const existing = await this.assignmentRepo.findOne({
      where: {
        organizationId: data.organizationId,
        positionId: data.positionId,
        userId: data.userId,
        status: 'active'
      }
    });

    if (existing) throw new BadRequestException('User is already assigned to this position in this organization');

    const assignment = this.assignmentRepo.create({
      ...data,
      status: 'active',
      startDate: new Date()
    });

    return this.assignmentRepo.save(assignment);
  }

  async revokeAssignment(id: number) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    assignment.status = 'revoked';
    assignment.endDate = new Date();
    return this.assignmentRepo.save(assignment);
  }

  async transferPosition(id: number, targetUserId: number, assignedBy: number) {
    const oldAssignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!oldAssignment) throw new NotFoundException('Assignment not found');

    // 1. Revoke old
    oldAssignment.status = 'transferred';
    oldAssignment.endDate = new Date();
    await this.assignmentRepo.save(oldAssignment);

    // 2. Create new
    return this.assignPosition({
      organizationId: oldAssignment.organizationId,
      positionId: oldAssignment.positionId,
      userId: targetUserId,
      assignedBy
    });
  }
}
