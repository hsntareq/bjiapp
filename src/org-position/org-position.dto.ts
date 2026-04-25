import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export const VALID_GROUPS = ['EXECUTIVE', 'SHURA', 'KORMO_PORISHODH', 'TEAM'] as const;
export type PositionGroup = typeof VALID_GROUPS[number];

export class CreateOrgPositionDto {
  @IsInt()
  organizationId: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  positionTitle: string;

  @IsString()
  @IsNotEmpty()
  positionGroup: PositionGroup;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class UpdateOrgPositionDto {
  @IsOptional()
  @IsInt()
  userId?: number | null;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  positionTitle?: string;

  @IsOptional()
  @IsString()
  positionGroup?: PositionGroup;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
