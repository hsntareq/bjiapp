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
import { MonthlyReportService } from './monthly-report.service';
import { UpsertMonthlyReportDto } from './dto/monthly-report.dto';
import { UsersService } from '../users/users.service';

@Controller('monthly-report')
export class MonthlyReportController {
  constructor(
    private readonly service: MonthlyReportService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getReport(@Req() req: any, @Query('month') month: string, @Query('userId') userId?: string) {
    // Get userId from param or authenticated user
    const resolvedUserId = userId || req.user?.userId;
    if (!resolvedUserId) throw new UnauthorizedException('userId required');
    const user = await this.usersService.findById(parseInt(resolvedUserId));
    if (!user) throw new UnauthorizedException();
    return this.service.getByMonth(user, month);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async upsertReport(@Req() req: any, @Body() dto: UpsertMonthlyReportDto) {
    if (!req.user) throw new UnauthorizedException();
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new UnauthorizedException();
    return this.service.upsert(user, dto);
  }
}
