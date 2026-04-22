import { IsDateString } from 'class-validator';

export class PersonalReportTimerDto {
  @IsDateString()
  date!: string;
}
