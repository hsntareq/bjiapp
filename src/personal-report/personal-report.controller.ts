import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { CreatePersonalReportDto } from './dto/create-personal-report.dto';
import { PersonalReportTimerDto } from './dto/personal-report-timer.dto';
import { PersonalReport } from './personal-report.entity';
import { PersonalReportService } from './personal-report.service';

@Controller('personal-report')
export class PersonalReportController {
  constructor(
    private readonly reportService: PersonalReportService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Request() req: { user: { userId: number; username: string } },
    @Body() body: CreatePersonalReportDto,
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new NotFoundException('User not found');
    return this.reportService.createReport(user, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('timer/start')
  async startTimer(
    @Request() req: { user: { userId: number; username: string } },
    @Body() body: PersonalReportTimerDto,
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new NotFoundException('User not found');
    return this.reportService.startOrgWorkTimer(user, body.date);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('timer/pause')
  async pauseTimer(
    @Request() req: { user: { userId: number; username: string } },
    @Body() body: PersonalReportTimerDto,
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new NotFoundException('User not found');
    return this.reportService.pauseOrgWorkTimer(user, body.date);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('monthly-summary')
  async getMonthlySummary(
    @Request() req: { user: { userId: number; username: string } },
    @Query('month') month: string,
  ) {
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw new NotFoundException('Invalid month format. Expected YYYY-MM');
    }
    return this.reportService.getMonthlySummary(req.user.userId, month);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getForUser(
    @Request() req: { user: { userId: number; username: string } },
    @Query('date') date?: string,
  ): Promise<PersonalReport | null> {
    // Use ?date=YYYY-MM-DD, default to today
    const useDate = date || new Date().toISOString().slice(0, 10);
    const report = await this.reportService.getReportByDate(req.user.userId, useDate);
    return report ?? null;
  }
}
