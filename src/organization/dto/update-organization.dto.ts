import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

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
