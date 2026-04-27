import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateComprehensiveReportDto {
  @IsNumber()
  organizationId: number;

  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsObject() @IsOptional()
  headerInfo?: Record<string, any>;

  @IsObject() @IsOptional()
  unitDawat?: Record<string, any>;

  @IsObject() @IsOptional()
  personalDawat?: Record<string, any>;

  @IsObject() @IsOptional()
  generalMeeting?: Record<string, any>;

  @IsObject() @IsOptional()
  publicRelations?: Record<string, any>;

  @IsObject() @IsOptional()
  departmentalInfo?: Record<string, any>;

  @IsObject() @IsOptional()
  dawahPublication?: Record<string, any>;

  @IsObject() @IsOptional()
  finance?: Record<string, any>;

  @IsObject() @IsOptional()
  miscellaneous?: Record<string, any>;
}
