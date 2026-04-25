export class PersonalReportSummaryDto {
  totalReports: number;
  averageQuranStudyDays: number;
  totalHaditsRead: number;
  averageSalahJamaat: number;
  safarsCount: number;
  totalOrgWorkHours: number;
  totalContactsDawah: number;
  totalContactsWorker: number;
  totalContactsMember: number;
  bookDistributed: number;
  familyMeetingsCount: number;
  socialWorkCount: number;
}

export class MonthlyPlanSummaryDto {
  totalPlans: number;
  averageQuranStudyGoal: number;
  averageOrgWorkHoursGoal: number;
  totalMembershipGrowthTargets: number;
  totalMemorizationTargets: number;
}

export class MonthlyReportSummaryDto {
  totalReports: number;
  totalMembersRecruited: number;
  totalActivistRecruited: number;
  totalAssociateRecruited: number;
  totalMemorizations: number;
  totalBaitulmalAmount: number;
  totalBooksDistributed: number;
}

export class TeamPerformanceDto {
  organizationId: number;
  organizationName: string;
  organizationType: string;
  totalMembers: number;
  activeMembers: number;
  reportSubmissionRate: number; // percentage
  averageEngagementScore: number; // 0-100
  personalReportsSummary: PersonalReportSummaryDto;
  monthlyPlansSummary: MonthlyPlanSummaryDto;
  monthlyReportsSummary: MonthlyReportSummaryDto;
  lastUpdated: Date;
}

export class DashboardDto {
  myOrganization: TeamPerformanceDto;
  subordinatesPerformance: TeamPerformanceDto[];
  comparisonWithPeer: any;
  metrics: {
    growthTrend: { month: string; recruits: number }[];
    engagementTrend: { month: string; score: number }[];
  };
}

export class OrganizationDashboardStatsDto {
  organizationId: number;
  organizationName: string;
  organizationType: string;
  totalUsers: number;
  totalSubordinates: number;
  activeUsers: number;
  inactiveUsers: number;
  reportsThisMonth: number;
  reportsLastMonth: number;
  reportSubmissionRate: number; // percentage
  avgReportSubmissionDate: string; // YYYY-MM-DD
  topMembers: Array<{
    id: number;
    name: string;
    email: string;
    reportsSubmitted: number;
    engagementScore: number;
  }>;
}
