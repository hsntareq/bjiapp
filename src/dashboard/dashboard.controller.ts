import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrgContext } from '../common/decorators';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get organization dashboard for current user's org
   * GET /dashboard/my-org
   */
  @Get('my-org')
  async getMyOrgDashboard(@OrgContext() orgContext: any) {
    return this.dashboardService.getOrganizationDashboard(orgContext.organizationId);
  }

  /**
   * Get team performance for current user's org
   * GET /dashboard/team-performance
   */
  @Get('team-performance')
  async getTeamPerformance(@OrgContext() orgContext: any) {
    return this.dashboardService.getTeamPerformance(orgContext.organizationId);
  }

  /**
   * Get organization dashboard by ID
   * GET /dashboard/organization/:id
   */
  @Get('organization/:id')
  async getOrgDashboard(@Param('id', ParseIntPipe) organizationId: number) {
    return this.dashboardService.getOrganizationDashboard(organizationId);
  }

  /**
   * Get team performance for specific organization
   * GET /dashboard/organization/:id/performance
   */
  @Get('organization/:id/performance')
  async getOrgTeamPerformance(@Param('id', ParseIntPipe) organizationId: number) {
    return this.dashboardService.getTeamPerformance(organizationId);
  }
}
