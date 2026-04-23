import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyReport } from './monthly-report.entity';
import { MonthlyReportController } from './monthly-report.controller';
import { MonthlyReportService } from './monthly-report.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyReport]), UsersModule],
  providers: [MonthlyReportService],
  controllers: [MonthlyReportController],
})
export class MonthlyReportModule {}
