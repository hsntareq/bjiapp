import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyPlan } from './monthly-plan.entity';
import { MonthlyPlanService } from './monthly-plan.service';
import { MonthlyPlanController } from './monthly-plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyPlan])],
  providers: [MonthlyPlanService],
  controllers: [MonthlyPlanController],
  exports: [MonthlyPlanService],
})
export class MonthlyPlanModule {}
