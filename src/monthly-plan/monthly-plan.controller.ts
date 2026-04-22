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

@Controller('monthly-plan')
@UseGuards(AuthGuard('jwt'))
export class MonthlyPlanController {
  constructor(private readonly service: MonthlyPlanService) {}

  @Get()
  async getPlan(@Req() req: any, @Query('month') month: string) {
    if (!req.user) throw new UnauthorizedException();
    return this.service.getByMonth(req.user, month);
  }

  @Post()
  async upsertPlan(@Req() req: any, @Body() dto: UpsertMonthlyPlanDto) {
    if (!req.user) throw new UnauthorizedException();
    return this.service.upsert(req.user, dto);
  }
}
