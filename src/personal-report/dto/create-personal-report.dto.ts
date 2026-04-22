import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsInt, Max, Min } from 'class-validator';

export class CreatePersonalReportDto {
  @IsDateString()
  date!: string;

  @IsBoolean()
  quranStudy!: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  haditsRead!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  literature!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  salahJamaat!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  targetContactDawah!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  targetContactWorker!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  targetContactMember!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  workerContact!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  bookDistribution!: number;

  @IsBoolean()
  familyMeeting!: boolean;

  @IsBoolean()
  socialWork!: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  orgWorkHours!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(59)
  orgWorkMinutes!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(59)
  orgWorkSeconds!: number;

  @IsBoolean()
  safar!: boolean;

  @IsBoolean()
  reportKeeping!: boolean;

  @IsBoolean()
  selfCriticism!: boolean;
}
