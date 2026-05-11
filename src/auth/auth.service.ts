import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Organization, OrganizationPositionAssignment } from '../common/entities';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(OrganizationPositionAssignment)
    private assignmentRepository: Repository<OrganizationPositionAssignment>,
    private jwtService: JwtService,
  ) {}

  async register(data: { email?: string; phone?: string; password: string }) {
    if (!data.email && !data.phone) {
      throw new HttpException('Email or phone is required', HttpStatus.BAD_REQUEST);
    }
    if (data.email) {
      const existing = await this.usersRepository.findOne({ where: { email: data.email } });
      if (existing) {
        throw new HttpException('Email already registered', HttpStatus.CONFLICT);
      }
    }
    if (data.phone) {
      const existing = await this.usersRepository.findOne({ where: { phone: data.phone } });
      if (existing) {
        throw new HttpException('Phone already registered', HttpStatus.CONFLICT);
      }
    }
    const effectivePassword = data.email || data.phone || data.password;
    const hashedPassword = await bcrypt.hash(effectivePassword, 10);
    const user = this.usersRepository.create({
      email: data.email,
      phone: data.phone,
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

  async validateUserByPhone(phone: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { phone } });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    return this.validateUserByEmail(email, pass);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, organizationId: user.organizationId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organizationId,
      },
    };
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
    return null;
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

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const userAssignments = await this.assignmentRepository.find({
      where: { userId: userId, status: 'active' },
      relations: ['position', 'organization', 'organization.level', 'organization.parent', 'organization.parent.level'],
    });

    if (organizationId) {
      const currentAssignment = userAssignments.find(a => a.organizationId === organizationId);
      if (currentAssignment) {
        orgType = currentAssignment.organization?.level?.slug?.toUpperCase() || null;
        orgName = currentAssignment.organization?.name || null;
        positionTitle = currentAssignment.position?.name || currentAssignment.positionTitle;
        positionGroup = currentAssignment.position?.isExecutive ? 'EXECUTIVE' : (currentAssignment.positionGroup || 'MEMBER');
        
        if (currentAssignment.organization?.parent) {
          parentOrgId = currentAssignment.organization.parent.id;
          parentOrgType = currentAssignment.organization.parent.level?.slug?.toUpperCase() || null;
        }
      }
    }
    
    const hasExecPosition = userAssignments.some(a => 
      a.position?.isExecutive || a.positionGroup === 'EXECUTIVE'
    );
    const belongsToHighLevel = userAssignments.some(a => 
      a.organization?.level?.slug && ['CENTRAL', 'CITY'].includes(a.organization.level.slug.toUpperCase())
    );

    const hasOrgAccess = 
      hasExecPosition || 
      belongsToHighLevel || 
      (user && (user.canCreateUsers || user.email === 'admin@bjioms.com' || user.email === 'central@bjioms.com'));

    return {
      userId,
      organizationId: organizationId ?? null,
      orgType,
      orgName,
      parentOrgId,
      parentOrgType,
      positionTitle,
      positionGroup,
      hasOrgAccess: !!hasOrgAccess,
    };
  }

  async changePassword(userId: number, oldPass: string, newPass: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.password) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid current password', HttpStatus.UNAUTHORIZED);
    }
    user.password = await bcrypt.hash(newPass, 10);
    await this.usersRepository.save(user);
    return { success: true, message: 'Password updated successfully' };
  }

  async adminResetPassword(adminUserId: number, targetUserId: number, newPass: string) {
    const admin = await this.usersRepository.findOne({ where: { id: adminUserId } });
    if (!admin || !admin.canCreateUsers) {
      throw new HttpException('Unauthorized. Only admins can reset passwords.', HttpStatus.FORBIDDEN);
    }

    const targetUser = await this.usersRepository.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new HttpException('Target user not found', HttpStatus.NOT_FOUND);
    }

    targetUser.password = await bcrypt.hash(newPass, 10);
    await this.usersRepository.save(targetUser);
    return { success: true, message: `Password for user ${targetUser.email || targetUser.phone} has been reset.` };
  }
}
