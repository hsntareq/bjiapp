import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum OrganizationType {
  CENTRAL = 'CENTRAL',
  CITY = 'CITY',
  THANA = 'THANA',
  WARD = 'WARD',
  UNIT = 'UNIT',
}

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsEnum(OrganizationType)
  type: OrganizationType;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsString()
  division?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  thana?: string;

  @IsOptional()
  @IsNumber()
  wardNumber?: number;

  @IsOptional()
  @IsString()
  unitName?: string;
}
