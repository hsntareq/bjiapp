import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyPlan } from './monthly-plan.entity';
import { MonthlyPlanService } from './monthly-plan.service';
import { MonthlyPlanController } from './monthly-plan.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyPlan]), UsersModule],
  providers: [MonthlyPlanService],
  controllers: [MonthlyPlanController],
  exports: [MonthlyPlanService],
})
export class MonthlyPlanModule {}
