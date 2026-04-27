import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ComprehensiveReportService } from './comprehensive-report.service';
import { CreateComprehensiveReportDto } from './dto/create-comprehensive-report.dto';
import { UpdateComprehensiveReportDto } from './dto/update-comprehensive-report.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('comprehensive-report')
export class ComprehensiveReportController {
  constructor(private readonly reportService: ComprehensiveReportService) {}

  @Post()
  createOrUpdate(@Body() createDto: CreateComprehensiveReportDto) {
    return this.reportService.createOrUpdate(createDto);
  }

  @Get('organization/:orgId')
  findOne(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.reportService.findOne(orgId, year, month);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateComprehensiveReportDto) {
    return this.reportService.update(id, updateDto);
  }
}
