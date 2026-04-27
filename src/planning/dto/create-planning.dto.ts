import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlanningDto {
  @IsNumber()
  organizationId: number;

  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsNumber()
  @IsOptional()
  dawatTarget?: number;

  @IsNumber()
  @IsOptional()
  dawatAchieved?: number;

  @IsNumber()
  @IsOptional()
  activistTarget?: number;

  @IsNumber()
  @IsOptional()
  activistAchieved?: number;

  @IsNumber()
  @IsOptional()
  memberTarget?: number;

  @IsNumber()
  @IsOptional()
  memberAchieved?: number;

  @IsNumber()
  @IsOptional()
  programTarget?: number;

  @IsNumber()
  @IsOptional()
  programAchieved?: number;

  @IsString()
  @IsOptional()
  programDetails?: string;

  @IsNumber()
  @IsOptional()
  donationTarget?: number;

  @IsNumber()
  @IsOptional()
  donationAchieved?: number;
}
