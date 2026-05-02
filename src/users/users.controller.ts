import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    // Only return id, name, email, and responsibility/role
    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user.id,
      fullname: user.name,
      email: user.email,
      responsibility: user.role ? user.role.name : null,
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
