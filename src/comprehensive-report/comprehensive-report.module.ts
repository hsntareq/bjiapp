import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprehensiveReport } from './comprehensive-report.entity';
import { ComprehensiveReportService } from './comprehensive-report.service';
import { ComprehensiveReportController } from './comprehensive-report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComprehensiveReport])],
  providers: [ComprehensiveReportService],
  controllers: [ComprehensiveReportController],
})
export class ComprehensiveReportModule {}
