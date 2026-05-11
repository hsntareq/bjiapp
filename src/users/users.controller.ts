import { Controller, Get, Post, Body, Query, UseGuards, Req, Param, Delete, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    const qb = this.usersService.findAllQueryBuilder(search);
    const users = await qb.leftJoinAndSelect('user.assignments', 'assignments')
      .leftJoinAndSelect('assignments.organization', 'posOrg')
      .leftJoinAndSelect('assignments.position', 'position')
      .leftJoinAndSelect('user.payments', 'payments')
      .getMany();
    
    return users.map(user => ({
      id: user.id,
      fullname: user.fullname || user.name,
      email: user.email,
      phone: user.phone || null,
      bloodGroup: (user as any).bloodGroup || null,
      responsibility: user.role ? user.role.name : null,
      organization: (user as any).organization?.name || null,
      organizationId: (user as any).organization?.id || null,
      organizationType: (user as any).organization?.type || null,
      thana: (user as any).organization?.thana || null,
      city: (user as any).organization?.city || null,
      rank: (user as any).rank || null,
      isAdv: (user as any).isAdv ?? false,
      monthlyBaitulmalTarget: user.monthlyBaitulmalAmount || 0,
      monthlyBaitulmalPaid: user.isMonthlyBaitulmalPaid ? (user.monthlyBaitulmalAmount || 0) : 0,
      yearlyDonationTarget: user.yearlyDonationAmount || 0,
      yearlyDonationPaid: user.yearlyDonationPaid || 0,
      knowledgebaseId: user.knowledgebaseId,
      address: user.address,
      nid: user.nid,
      photo: user.photo,
      jobTitle: user.jobTitle,
      jobOrganization: user.jobOrganization,
      officeAddress: user.officeAddress,
      monthlyBaitulmalStatus: user.isMonthlyBaitulmalPaid ? 'Paid' : `Remaining: ৳${user.monthlyBaitulmalAmount || 0}`,
      yearlyDonationRemaining: `Remaining: ৳${(user.yearlyDonationAmount || 0) - (user.yearlyDonationPaid || 0)}`,
      academicQualifications: user.academicQualifications?.map(q => ({
        degree: q.degree || q.qualification,
        subject: q.subject || q.department,
        institution: q.institution,
        year: q.year,
      })) || [],
      positions: user.assignments?.map(p => ({
        organizationId: p.organizationId,
        organizationName: p.organization?.name,
        positionTitle: p.position?.name,
        positionGroup: p.position?.isExecutive ? 'EXECUTIVE' : 'MEMBER',
        isActive: p.status === 'active',
      })) || [],
      payments: user.payments?.sort((a, b) => (b.year * 100 + b.month) - (a.year * 100 + a.month)) || [],
    }));
  }

  @Get(':id/payments')
  async getUserPayments(@Param('id') id: string) {
    const payments = await this.usersService.getUserPayments(parseInt(id));
    // Group by year
    const grouped = payments.reduce((acc, p) => {
      if (!acc[p.year]) acc[p.year] = [];
      acc[p.year].push(p);
      return acc;
    }, {});
    return grouped;
  }

  @Get('by-organization')
  @UseGuards(AuthGuard('jwt'))
  async findByOrganization(
    @Query('orgId') orgId: string,
    @Query('level') level: string,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.userId;
    const userOrgId = (req as any).user?.organizationId;

    return this.usersService.getUsersWithOrgHierarchy(
      parseInt(orgId),
      level,
      userId,
      userOrgId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: Request) {
    const requesterUserId = (req as any).user?.userId || (req as any).user?.sub;
    const requester = await this.usersService.findById(parseInt(requesterUserId));
    
    if (!requester?.canCreateUsers && requester?.email !== 'admin@bjioms.com' && requester?.email !== 'central@bjioms.com') {
      throw new BadRequestException('Unauthorized. Only admins can remove users.');
    }

    return this.usersService.remove(parseInt(id));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: any, @Req() req: Request) {
    const requesterUserId = (req as any).user?.userId || (req as any).user?.sub;
    const requester = await this.usersService.findById(parseInt(requesterUserId));
    
    if (!requester?.canCreateUsers && requester?.email !== 'admin@bjioms.com' && requester?.email !== 'central@bjioms.com') {
      throw new BadRequestException('Unauthorized. Only admins can create users.');
    }

    return this.usersService.createUser(body);
  }
}
