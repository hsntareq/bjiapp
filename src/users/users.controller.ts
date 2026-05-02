import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    const users = await this.usersService.findAll(search);
    return users.map(user => ({
      id: user.id,
      fullname: user.name,
      email: user.email,
      mobile: user.mobile || null,
      bloodGroup: (user as any).bloodGroup || null,
      responsibility: user.role ? user.role.name : null,
      organization: (user as any).organization?.name || null,
      organizationId: (user as any).organization?.id || null,
      organizationType: (user as any).organization?.type || null,
      thana: (user as any).organization?.thana || null,
      city: (user as any).organization?.city || null,
      rank: (user as any).rank || null,
      isAdv: (user as any).isAdv ?? false,
    }));
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
}
