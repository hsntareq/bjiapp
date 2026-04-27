import { PartialType } from '@nestjs/mapped-types';
import { CreateComprehensiveReportDto } from './create-comprehensive-report.dto';

export class UpdateComprehensiveReportDto extends PartialType(CreateComprehensiveReportDto) {}
