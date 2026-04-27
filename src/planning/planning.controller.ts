import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  create(@Body() createPlanningDto: CreatePlanningDto) {
    return this.planningService.create(createPlanningDto);
  }

  @Get('organization/:orgId')
  findAllByOrganization(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.planningService.findAllByOrganization(
      orgId,
      year ? parseInt(year) : undefined,
      month ? parseInt(month) : undefined
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planningService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanningDto: UpdatePlanningDto) {
    return this.planningService.update(id, updatePlanningDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planningService.remove(id);
  }
}
