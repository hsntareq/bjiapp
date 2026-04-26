import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../common/guards';
import { AddMemberDto, CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * Create a new organization
   * POST /organization
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrgDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrgDto);
  }

  /**
   * Get all organizations (optionally filtered by type)
   * GET /organization
   * GET /organization?type=CITY
   */
  @Get()
  async findAll(@Query('type') type?: string) {
    if (type) {
      return this.organizationService.findByType(type);
    }
    return this.organizationService.findAll();
  }

  /**
   * Get organizational hierarchy tree (all levels)
   * GET /organization/hierarchy/tree
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('hierarchy/tree')
  async getHierarchyTree(@Request() req: any, @Query('global') global?: string) {
    if (global === 'true') {
      return this.organizationService.getHierarchyTree();
    }
    return this.organizationService.getHierarchyTree(req.user.userId);
  }

  /**
   * Get organization statistics
   * GET /organization/stats
   */
  @Get('stats')
  async getStatistics() {
    return this.organizationService.getStatistics();
  }

  /**
   * Get single organization by ID with full path
   * GET /organization/:id
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.findById(id);
  }

  /**
   * Get organization with full ancestor path
   * GET /organization/:id/path
   */
  @Get(':id/path')
  async getWithPath(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.getWithPath(id);
  }

  /**
   * Get children of organization
   * GET /organization/:id/children
   */
  @Get(':id/children')
  async getChildren(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.getChildren(id);
  }

  /**
   * Get all descendants of organization
   * GET /organization/:id/descendants
   */
  @Get(':id/descendants')
  async getDescendants(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.getDescendants(id);
  }

  /**
   * Get members (direct users) of an organization
   * GET /organization/:id/members
   */
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id/members')
  async getMembers(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.getMembers(id);
  }

  /**
   * Get all subordinates (users in org and descendants)
   * GET /organization/:id/subordinates
   */
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id/subordinates')
  async getSubordinates(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.getSubordinates(id);
  }

  /**
   * Get team statistics for organization
   * GET /organization/:id/team-stats
   */
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id/team-stats')
  async getTeamStats(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.getTeamStats(id);
  }

  /**
   * Add member (user) to organization
   * POST /organization/:id/members
   */
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post(':id/members')
  @HttpCode(HttpStatus.OK)
  async addMember(
    @Param('id', ParseIntPipe) organizationId: number,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.organizationService.assignUserToOrg(addMemberDto.userId, organizationId);
  }

  /**
   * Remove member (user) from organization
   * DELETE /organization/:id/members/:userId
   */
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('id', ParseIntPipe) organizationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.organizationService.removeUserFromOrg(userId, organizationId);
  }

  /**
   * Update organization
   * PUT /organization/:id
   */
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateOrgDto: UpdateOrganizationDto) {
    return this.organizationService.update(id, updateOrgDto);
  }

  /**
   * Delete organization
   * DELETE /organization/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.delete(id);
  }
}
