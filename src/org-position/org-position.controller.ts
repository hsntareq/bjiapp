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
} from '@nestjs/common';
import { CreateOrgPositionDto, UpdateOrgPositionDto } from './org-position.dto';
import { OrgPositionService } from './org-position.service';

@Controller('org-positions')
export class OrgPositionController {
  constructor(private readonly service: OrgPositionService) {}

  /** GET /org-positions?organizationId=X */
  @Get()
  async findAll(@Query('organizationId', ParseIntPipe) organizationId: number) {
    return this.service.findByOrganization(organizationId);
  }

  /** POST /org-positions */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrgPositionDto) {
    return this.service.create(dto);
  }

  /** POST /org-positions/seed — auto-create default positions for an org */
  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  async seed(@Body() body: { organizationId: number; orgType: string }) {
    return this.service.seedDefaultPositions(body.organizationId, body.orgType);
  }

  /** PUT /org-positions/:id */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrgPositionDto,
  ) {
    return this.service.update(id, dto);
  }

  /** DELETE /org-positions/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
