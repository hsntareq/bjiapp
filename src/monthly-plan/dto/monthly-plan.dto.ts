export class UpsertMonthlyPlanDto {
  month!: string;
  quranStudyDays?: number;
  haditsRead?: number;
  literature?: number;
  salahJamaat?: number;
  targetContactDawah?: number;
  targetContactWorker?: number;
  targetContactMember?: number;
  workerContact?: number;
  bookDistribution?: number;
  familyMeetingDays?: number;
  socialWorkDays?: number;
  orgWorkHours?: number;
  safarDays?: number;
  reportKeepingDays?: number;
  selfCriticismDays?: number;

  increaseAssociate?: string[];
  increaseActivist?: string[];
  increaseMember?: string[];
  memorizingSura?: string[];
  memorizingAyat?: string[];
  memorizingHadits?: string[];
  baitulmalIncreaseAmount?: number;
  sellBooksNumber?: number;
  socialHelp?: string[];
  professionalHelp?: string[];
}
