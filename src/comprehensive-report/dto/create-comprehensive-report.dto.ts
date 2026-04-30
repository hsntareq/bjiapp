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
  prCampaign?: Record<string, any>;

  @IsObject() @IsOptional()
  departmentalInfo?: Record<string, any>;

  @IsObject() @IsOptional()
  dawahPublication?: Record<string, any>;

  @IsObject() @IsOptional()
  programs?: Record<string, any>;

  @IsObject() @IsOptional()
  manpower?: Record<string, any>;

  @IsObject() @IsOptional()
  deptManpower?: Record<string, any>;

  @IsObject() @IsOptional()
  unitStats?: Record<string, any>;

  @IsObject() @IsOptional()
  studentJoining?: Record<string, any>;

  @IsObject() @IsOptional()
  safar?: Record<string, any>;

  @IsObject() @IsOptional()
  donors?: Record<string, any>;

  @IsObject() @IsOptional()
  orgMeetings?: Record<string, any>;

  @IsObject() @IsOptional()
  training?: Record<string, any>;

  @IsObject() @IsOptional()
  socialWork?: Record<string, any>;

  @IsObject() @IsOptional()
  political?: Record<string, any>;

  @IsObject() @IsOptional()
  finance?: Record<string, any>;

  @IsObject() @IsOptional()
  miscellaneous?: Record<string, any>;

  @IsObject() @IsOptional()
  remarks?: Record<string, any>;

  @IsObject() @IsOptional()
  baitulmal?: Record<string, any>;

  @IsObject() @IsOptional()
  organizationData?: Record<string, any>;

  @IsObject() @IsOptional()
  dawah?: Record<string, any>;
}
