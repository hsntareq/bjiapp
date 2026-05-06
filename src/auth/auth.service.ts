import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Organization, OrgPosition } from '../common/entities';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(OrgPosition)
    private orgPositionRepository: Repository<OrgPosition>,
    private jwtService: JwtService,
  ) {}

  async register(data: { email?: string; mobile?: string; password: string }) {
    if (!data.email && !data.mobile) {
      throw new HttpException('Email or mobile is required', HttpStatus.BAD_REQUEST);
    }
    if (data.email) {
      const existing = await this.usersRepository.findOne({ where: { email: data.email } });
      if (existing) {
        throw new HttpException('Email already registered', HttpStatus.CONFLICT);
      }
    }
    if (data.mobile) {
      const existing = await this.usersRepository.findOne({ where: { mobile: data.mobile } });
      if (existing) {
        throw new HttpException('Mobile already registered', HttpStatus.CONFLICT);
      }
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      email: data.email,
      mobile: data.mobile,
      password: hashedPassword,
    });
    const saved = await this.usersRepository.save(user);
    const { password, ...result } = saved;
    return this.login(result);
  }

  async validateUserByEmail(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByMobile(mobile: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { mobile } });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async findOrCreateByGoogle(googleId: string, email: string): Promise<any> {
    let user = await this.usersRepository.findOne({ where: { googleId } });
    if (!user && email) {
      user = await this.usersRepository.findOne({ where: { email } });
    }
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user = await this.usersRepository.save(user);
      }
      const { password, ...result } = user;
      return result;
    }
    // Create new user from Google
    const newUser = this.usersRepository.create({ googleId, email });
    const saved = await this.usersRepository.save(newUser);
    const { password, ...result } = saved;
    return result;
  }

  async login(user: any) {
    // Load full user with role and organization for JWT payload
    const fullUser = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['role', 'organization'],
    });

    if (!fullUser) {
      throw new Error('User not found');
    }

    const payload = {
      username: fullUser.email || fullUser.mobile,
      sub: fullUser.id,
      organizationId: fullUser.organizationId,
      roleId: fullUser.roleId,
      canCreateUsers: fullUser.canCreateUsers,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMe(userId: number, organizationId: number): Promise<{
    userId: number;
    organizationId: number | null;
    orgType: string | null;
    orgName: string | null;
    parentOrgId: number | null;
    parentOrgType: string | null;
    positionTitle: string | null;
    positionGroup: string | null;
    hasOrgAccess: boolean;
  }> {
    let orgType: string | null = null;
    let orgName: string | null = null;
    let parentOrgId: number | null = null;
    let parentOrgType: string | null = null;
    let positionTitle: string | null = null;
    let positionGroup: string | null = null;

    if (organizationId) {
      const org = await this.orgRepository.findOne({
        where: { id: organizationId },
        relations: ['parent'],
      });
      if (org) {
        orgType = org.type;
        orgName = org.name;
        if (org.parent) {
          parentOrgId = org.parent.id;
          parentOrgType = org.parent.type;
        }
      }

      const position = await this.orgPositionRepository.findOne({
        where: { userId: userId as any, organizationId, isActive: true },
      });
      if (position) {
        positionTitle = position.positionTitle;
        positionGroup = position.positionGroup;
      }
    }

    // Access granted only for key leadership positions (not Baitulmal, Treasurer, etc.)
    const EXEC_TITLES = ['President', 'Secretary', 'Office', 'Office Secretary', 'Vice President', 'Joint Secretary'];
    const hasOrgAccess = !!positionTitle && EXEC_TITLES.some(
      (t) => positionTitle.toLowerCase().includes(t.toLowerCase())
    );

    return {
      userId,
      organizationId: organizationId ?? null,
      orgType,
      orgName,
      parentOrgId,
      parentOrgType,
      positionTitle,
      positionGroup,
      hasOrgAccess,
    };
  }
}
