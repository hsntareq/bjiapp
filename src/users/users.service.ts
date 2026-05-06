import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Organization } from '../common/entities';
import { UserPayment } from './user-payment.entity';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(UserPayment)
    private paymentRepository: Repository<UserPayment>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user === null ? undefined : user;
  }

  async findByMobile(mobile: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { mobile } });
    return user === null ? undefined : user;
  }

  async findByGoogleId(googleId: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { googleId } });
    return user === null ? undefined : user;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user === null ? undefined : user;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findAll(search?: string): Promise<User[]> {
    return this.findAllQueryBuilder(search).getMany();
  }

  findAllQueryBuilder(search?: string) {
    const qb = this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.organization', 'organization');

    if (search) {
      const q = `%${search.toLowerCase()}%`;
      qb.where(
        'LOWER(user.fullname) LIKE :q OR LOWER(user.name) LIKE :q OR LOWER(user.email) LIKE :q OR LOWER(organization.name) LIKE :q OR LOWER(role.name) LIKE :q',
        { q },
      );
    }

    return qb.orderBy('organization.name').addOrderBy('user.name');
  }

  async getUsersWithOrgHierarchy(
    orgId: number,
    level: string,
    userId?: number,
    userOrgId?: number,
  ): Promise<any> {
    // Get the organization
    const org = await this.orgRepository.findOne({
      where: { id: orgId },
      relations: ['children', 'parent'],
    });

    if (!org) {
      throw new BadRequestException(`Organization ${orgId} not found`);
    }

    // Validate user can access this org (must own it or be in a parent org)
    if (userOrgId && userOrgId !== orgId) {
      // Check if user's org is a parent of requested org
      let current: Organization | null = org;
      let isChild = false;
      while (current?.parent) {
        current = await this.orgRepository.findOne({
          where: { id: current.parentId },
          relations: ['parent'],
        });
        if (current?.id === userOrgId) {
          isChild = true;
          break;
        }
      }
      if (!isChild) {
        throw new BadRequestException('Access denied to this organization');
      }
    }

    // Get all child org IDs (recursively)
    const getChildOrgIds = async (parentOrg: Organization): Promise<number[]> => {
      const ids: number[] = [parentOrg.id];
      const children = await this.orgRepository.find({
        where: { parentId: parentOrg.id },
      });
      for (const child of children) {
        const childIds = await getChildOrgIds(child);
        ids.push(...childIds);
      }
      return ids;
    };

    const allOrgIds = await getChildOrgIds(org);
    const childOrgIds = allOrgIds.filter(id => id !== orgId);

    // Get users for current org
    const currentOrgUsers = await this.usersRepository.find({
      where: { organizationId: orgId },
      relations: ['role', 'organization', 'positions', 'positions.organization', 'payments'],
    });

    // Get users for child orgs
    const childOrgUsers = childOrgIds.length > 0
      ? await this.usersRepository.find({
          where: { organizationId: In(childOrgIds) },
          relations: ['role', 'organization', 'positions', 'positions.organization', 'payments'],
        })
      : [];

    const formatUser = (user: User, childOrgName?: string | null) => ({
      ...user,
      id: user.id,
      fullname: user.name,
      email: user.email,
      responsibility: user.role?.name || null,
      organization: user.organization?.name || 'Unknown',
      rank: (user as any).rank || null,
      isAdv: (user as any).isAdv ?? false,
      ...(childOrgName && { childOrgName }),
    });

    return {
      currentOrgUsers: currentOrgUsers.map(u => formatUser(u)),
      childOrgUsers: childOrgUsers.map(u => formatUser(u, u.organization?.name)),
    };
  }

  async getUserPayments(userId: number) {
    return this.paymentRepository.find({
      where: { userId },
      order: { year: 'DESC', month: 'DESC' },
    });
  }
}
