import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PersonalReportController } from './personal-report.controller';
import { PersonalReport } from './personal-report.entity';
import { PersonalReportService } from './personal-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalReport]), UsersModule],
  controllers: [PersonalReportController],
  providers: [PersonalReportService],
  exports: [PersonalReportService],
})
export class PersonalReportModule {}
