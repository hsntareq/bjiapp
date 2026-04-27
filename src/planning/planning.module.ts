import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { Planning } from './planning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planning])],
  providers: [PlanningService],
  controllers: [PlanningController]
})
export class PlanningModule {}
