import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../common/entities';
import { MonthlyPlan } from '../monthly-plan/monthly-plan.entity';
import { MonthlyReport } from '../monthly-report/monthly-report.entity';
import { PersonalReport } from '../personal-report/personal-report.entity';
import { User } from '../users/user.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, User, PersonalReport, MonthlyPlan, MonthlyReport]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
