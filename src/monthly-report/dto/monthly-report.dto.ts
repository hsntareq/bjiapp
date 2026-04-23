import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertMonthlyReportDto {
  @IsString()
  month!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  increaseAssociate?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  increaseActivist?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  increaseMember?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memorizingSura?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memorizingAyat?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memorizingHadits?: string[];

  @IsOptional()
  @IsNumber()
  baitulmalIncreaseAmount?: number;

  @IsOptional()
  @IsNumber()
  sellBooksNumber?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  socialHelp?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  professionalHelp?: string[];
}
