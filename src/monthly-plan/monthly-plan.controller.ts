import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MonthlyPlanService } from './monthly-plan.service';
import { UpsertMonthlyPlanDto } from './dto/monthly-plan.dto';

import { UsersService } from '../users/users.service';

@Controller('monthly-plan')
export class MonthlyPlanController {
  constructor(
    private readonly service: MonthlyPlanService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getPlan(@Req() req: any, @Query('month') month: string, @Query('userId') userId?: string) {
    // Get userId from param or authenticated user
    const resolvedUserId = userId || req.user?.userId;
    if (!resolvedUserId) throw new UnauthorizedException('userId required');
    const user = await this.usersService.findById(parseInt(resolvedUserId));
    if (!user) throw new UnauthorizedException();
    return this.service.getByMonth(user, month);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async upsertPlan(@Req() req: any, @Body() dto: UpsertMonthlyPlanDto) {
    if (!req.user) throw new UnauthorizedException();
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new UnauthorizedException();
    return this.service.upsert(user, dto);
  }
}
