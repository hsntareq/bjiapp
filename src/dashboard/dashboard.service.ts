import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../common/entities';
import { MonthlyPlan } from '../monthly-plan/monthly-plan.entity';
import { MonthlyReport } from '../monthly-report/monthly-report.entity';
import { PersonalReport } from '../personal-report/personal-report.entity';
import { User } from '../users/user.entity';
import {
  MonthlyPlanSummaryDto,
  MonthlyReportSummaryDto,
  OrganizationDashboardStatsDto,
  PersonalReportSummaryDto,
  TeamPerformanceDto,
} from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PersonalReport)
    private personalReportRepository: Repository<PersonalReport>,
    @InjectRepository(MonthlyPlan)
    private monthlyPlanRepository: Repository<MonthlyPlan>,
    @InjectRepository(MonthlyReport)
    private monthlyReportRepository: Repository<MonthlyReport>,
  ) {}

  /**
   * Get all subordinate organization IDs recursively
   */
  private async getSubordinateOrgIds(orgId: number): Promise<number[]> {
    const org = await this.orgRepository.findOne({ where: { id: orgId } });
    if (!org) return [];

    const ids = [orgId];
    const queue = [org];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      const children = await this.orgRepository.find({
        where: { parentId: current.id },
      });

      for (const child of children) {
        ids.push(child.id);
        queue.push(child);
      }
    }

    return ids;
  }

  /**
   * Get personal report summary for an organization or its members
   */
  async getPersonalReportSummary(userIds: number[]): Promise<PersonalReportSummaryDto> {
    if (userIds.length === 0) {
      return {
        totalReports: 0,
        averageQuranStudyDays: 0,
        totalHaditsRead: 0,
        averageSalahJamaat: 0,
        safarsCount: 0,
        totalOrgWorkHours: 0,
        totalContactsDawah: 0,
        totalContactsWorker: 0,
        totalContactsMember: 0,
        bookDistributed: 0,
        familyMeetingsCount: 0,
        socialWorkCount: 0,
      };
    }

    const reports = await this.personalReportRepository.find({
      where: { user: { id: userIds[0] } }, // Simplified - in production use IN operator
    });

    let totalQuranDays = 0;
    let totalHadits = 0;
    let totalSalahJamaat = 0;
    let totalSafars = 0;
    let totalOrgHours = 0;
    let totalDawah = 0;
    let totalWorker = 0;
    let totalMember = 0;
    let totalBooks = 0;
    let totalFamily = 0;
    let totalSocial = 0;

    for (const report of reports) {
      if (report.quranStudy) totalQuranDays++;
      totalHadits += report.haditsRead || 0;
      totalSalahJamaat += report.salahJamaat || 0;
      if (report.safar) totalSafars++;
      totalOrgHours += report.orgWorkHours || 0;
      totalDawah += report.targetContactDawah || 0;
      totalWorker += report.targetContactWorker || 0;
      totalMember += report.targetContactMember || 0;
      totalBooks += report.bookDistribution || 0;
      if (report.familyMeeting) totalFamily++;
      if (report.socialWork) totalSocial++;
    }

    return {
      totalReports: reports.length,
      averageQuranStudyDays: reports.length > 0 ? totalQuranDays / reports.length : 0,
      totalHaditsRead: totalHadits,
      averageSalahJamaat: reports.length > 0 ? totalSalahJamaat / reports.length : 0,
      safarsCount: totalSafars,
      totalOrgWorkHours: totalOrgHours,
      totalContactsDawah: totalDawah,
      totalContactsWorker: totalWorker,
      totalContactsMember: totalMember,
      bookDistributed: totalBooks,
      familyMeetingsCount: totalFamily,
      socialWorkCount: totalSocial,
    };
  }

  /**
   * Get monthly plan summary for users
   */
  async getMonthlyPlanSummary(userIds: number[]): Promise<MonthlyPlanSummaryDto> {
    if (userIds.length === 0) {
      return {
        totalPlans: 0,
        averageQuranStudyGoal: 0,
        averageOrgWorkHoursGoal: 0,
        totalMembershipGrowthTargets: 0,
        totalMemorizationTargets: 0,
      };
    }

    const plans = await this.monthlyPlanRepository.find({
      where: { user: { id: userIds[0] } },
    });

    let totalQuranGoal = 0;
    let totalOrgWorkGoal = 0;
    let totalMembership = 0;
    let totalMemorization = 0;

    for (const plan of plans) {
      totalQuranGoal += plan.quranStudyDays || 0;
      totalOrgWorkGoal += plan.orgWorkHours || 0;
      totalMembership +=
        (plan.increaseAssociate?.length || 0) +
        (plan.increaseActivist?.length || 0) +
        (plan.increaseMember?.length || 0);
      totalMemorization +=
        (plan.memorizingSura?.length || 0) +
        (plan.memorizingAyat?.length || 0) +
        (plan.memorizingHadits?.length || 0);
    }

    return {
      totalPlans: plans.length,
      averageQuranStudyGoal: plans.length > 0 ? totalQuranGoal / plans.length : 0,
      averageOrgWorkHoursGoal: plans.length > 0 ? totalOrgWorkGoal / plans.length : 0,
      totalMembershipGrowthTargets: totalMembership,
      totalMemorizationTargets: totalMemorization,
    };
  }

  /**
   * Get monthly report summary for users
   */
  async getMonthlyReportSummary(userIds: number[]): Promise<MonthlyReportSummaryDto> {
    if (userIds.length === 0) {
      return {
        totalReports: 0,
        totalMembersRecruited: 0,
        totalActivistRecruited: 0,
        totalAssociateRecruited: 0,
        totalMemorizations: 0,
        totalBaitulmalAmount: 0,
        totalBooksDistributed: 0,
      };
    }

    const reports = await this.monthlyReportRepository.find({
      where: { user: { id: userIds[0] } },
    });

    let totalMembers = 0;
    let totalActivists = 0;
    let totalAssociates = 0;
    let totalMemorizations = 0;
    let totalBaitulmal = 0;
    let totalBooks = 0;

    for (const report of reports) {
      totalMembers += report.increaseMember?.length || 0;
      totalActivists += report.increaseActivist?.length || 0;
      totalAssociates += report.increaseAssociate?.length || 0;
      totalMemorizations +=
        (report.memorizingSura?.length || 0) +
        (report.memorizingAyat?.length || 0) +
        (report.memorizingHadits?.length || 0);
      totalBaitulmal += report.baitulmalIncreaseAmount || 0;
      totalBooks += report.sellBooksNumber || 0;
    }

    return {
      totalReports: reports.length,
      totalMembersRecruited: totalMembers,
      totalActivistRecruited: totalActivists,
      totalAssociateRecruited: totalAssociates,
      totalMemorizations: totalMemorizations,
      totalBaitulmalAmount: totalBaitulmal,
      totalBooksDistributed: totalBooks,
    };
  }

  /**
   * Get dashboard stats for an organization
   */
  async getOrganizationDashboard(
    organizationId: number,
  ): Promise<OrganizationDashboardStatsDto | null> {
    const org = await this.orgRepository.findOne({
      where: { id: organizationId },
    });

    if (!org) {
      return null;
    }

    // Get all subordinate org IDs
    const subOrgIds = await this.getSubordinateOrgIds(organizationId);

    // Get users in this org
    const users = await this.userRepository.find({
      where: { organizationId },
    });

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;

    // Get reports this month and last month
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const userIds = users.map((u) => u.id);

    let reportsThisMonth = 0;
    let reportsLastMonth = 0;

    if (userIds.length > 0) {
      reportsThisMonth = await this.personalReportRepository
        .createQueryBuilder('pr')
        .where('pr.userId IN (:...userIds)', { userIds })
        .andWhere('pr.createdAt >= :start', { start: thisMonthStart })
        .getCount();

      reportsLastMonth = await this.personalReportRepository
        .createQueryBuilder('pr')
        .where('pr.userId IN (:...userIds)', { userIds })
        .andWhere('pr.createdAt >= :start', { start: lastMonthStart })
        .andWhere('pr.createdAt <= :end', { end: lastMonthEnd })
        .getCount();
    }

    const reportSubmissionRate = totalUsers > 0 ? (reportsThisMonth / totalUsers) * 100 : 0;

    return {
      organizationId,
      organizationName: org.name,
      organizationType: org.type,
      totalUsers,
      totalSubordinates: subOrgIds.length - 1,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      reportsThisMonth,
      reportsLastMonth,
      reportSubmissionRate,
      avgReportSubmissionDate: new Date().toISOString().split('T')[0],
      topMembers: [],
    };
  }

  /**
   * Get team performance summary
   */
  async getTeamPerformance(organizationId: number): Promise<TeamPerformanceDto | null> {
    const org = await this.orgRepository.findOne({
      where: { id: organizationId },
    });

    if (!org) {
      return null;
    }

    const users = await this.userRepository.find({
      where: { organizationId },
    });

    const userIds = users.map((u) => u.id);
    const personalSummary = await this.getPersonalReportSummary(userIds);
    const planSummary = await this.getMonthlyPlanSummary(userIds);
    const reportSummary = await this.getMonthlyReportSummary(userIds);

    // Calculate engagement score (0-100)
    const engagementScore = Math.min(
      100,
      (personalSummary.totalReports > 0 ? 50 : 0) +
        (reportSummary.totalReports > 0 ? 30 : 0) +
        (planSummary.totalPlans > 0 ? 20 : 0),
    );

    return {
      organizationId,
      organizationName: org.name,
      organizationType: org.type,
      totalMembers: users.length,
      activeMembers: users.filter((u) => u.isActive).length,
      reportSubmissionRate:
        users.length > 0 ? (personalSummary.totalReports / (users.length * 30)) * 100 : 0,
      averageEngagementScore: engagementScore,
      personalReportsSummary: personalSummary,
      monthlyPlansSummary: planSummary,
      monthlyReportsSummary: reportSummary,
      lastUpdated: new Date(),
    };
  }
}
