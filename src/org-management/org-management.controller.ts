import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { OrgManagementService } from './org-management.service';

@Controller('org-management')
@UseGuards(AuthGuard('jwt'))
export class OrgManagementController {
  constructor(private readonly orgService: OrgManagementService) {}

  @Post('seed')
  async seed() {
    await this.orgService.seedHierarchicalStructure();
    return { message: 'Hierarchy seeded successfully' };
  }

  @Post('organizations')
  createOrganization(@Body() data: any) {
    return this.orgService.createOrganization(data);
  }

  @Put('organizations/:id')
  updateOrganization(@Param('id') id: number, @Body() data: any) {
    return this.orgService.updateOrganization(id, data);
  }

  @Delete('organizations/:id')
  deleteOrganization(@Param('id') id: number) {
    return this.orgService.deleteOrganization(id);
  }

  @Get('organizations/tree')
  getTree(@Req() req: Request, @Query('rootId') rootId?: number) {
    const user = (req as any).user;
    
    // If not super admin or central amir, force rooting to their own organization
    if (user.email !== 'admin@bjioms.com' && user.email !== 'central@bjioms.com') {
      const effectiveRootId = rootId || user.organizationId;
      // TODO: Verify that requested rootId is actually a child of user.organizationId
      return this.orgService.getOrganizationTree(effectiveRootId);
    }
    
    return this.orgService.getOrganizationTree(rootId);
  }

  @Post('positions')
  createPosition(@Body() data: any) {
    return this.orgService.createPosition(data);
  }

  @Get('levels/:levelId/positions')
  getPositions(@Param('levelId') levelId: number) {
    return this.orgService.getPositionsByLevel(levelId);
  }

  @Post('assignments')
  assign(@Body() data: any) {
    return this.orgService.assignPosition(data);
  }

  @Put('assignments/:id/revoke')
  revoke(@Param('id') id: number) {
    return this.orgService.revokeAssignment(id);
  }

  @Put('assignments/:id/transfer')
  transfer(@Param('id') id: number, @Body('targetUserId') targetUserId: number, @Body('assignedBy') assignedBy: number) {
    return this.orgService.transferPosition(id, targetUserId, assignedBy);
  }
}
