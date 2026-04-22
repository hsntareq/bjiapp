import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertMonthlyPlanDto {
  @IsString()
  month!: string;

  @IsOptional()
  @IsNumber()
  quranStudyDays?: number;

  @IsOptional()
  @IsNumber()
  haditsRead?: number;

  @IsOptional()
  @IsNumber()
  literature?: number;

  @IsOptional()
  @IsNumber()
  salahJamaat?: number;

  @IsOptional()
  @IsNumber()
  targetContactDawah?: number;

  @IsOptional()
  @IsNumber()
  targetContactWorker?: number;

  @IsOptional()
  @IsNumber()
  targetContactMember?: number;

  @IsOptional()
  @IsNumber()
  workerContact?: number;

  @IsOptional()
  @IsNumber()
  bookDistribution?: number;

  @IsOptional()
  @IsNumber()
  familyMeetingDays?: number;

  @IsOptional()
  @IsNumber()
  socialWorkDays?: number;

  @IsOptional()
  @IsNumber()
  orgWorkHours?: number;

  @IsOptional()
  @IsNumber()
  safarDays?: number;

  @IsOptional()
  @IsNumber()
  reportKeepingDays?: number;

  @IsOptional()
  @IsNumber()
  selfCriticismDays?: number;

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
