import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprehensiveReport } from './comprehensive-report.entity';
import { Organization } from '../common/entities';
import { ComprehensiveReportService } from './comprehensive-report.service';
import { ComprehensiveReportController } from './comprehensive-report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComprehensiveReport, Organization])],
  providers: [ComprehensiveReportService],
  controllers: [ComprehensiveReportController],
})
export class ComprehensiveReportModule {}
