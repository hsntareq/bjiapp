import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from './planning.entity';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async create(createPlanningDto: CreatePlanningDto): Promise<Planning> {
    const existing = await this.planningRepository.findOne({
      where: {
        organizationId: createPlanningDto.organizationId,
        year: createPlanningDto.year,
        month: createPlanningDto.month,
      },
    });

    if (existing) {
      return this.update(existing.id, createPlanningDto);
    }

    const planning = this.planningRepository.create(createPlanningDto);
    return this.planningRepository.save(planning);
  }

  async findAllByOrganization(organizationId: number, year?: number, month?: number): Promise<Planning[]> {
    const where: any = { organizationId };
    if (year) where.year = year;
    if (month) where.month = month;
    
    return this.planningRepository.find({
      where,
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Planning> {
    const planning = await this.planningRepository.findOne({ where: { id } });
    if (!planning) {
      throw new NotFoundException(`Planning with ID ${id} not found`);
    }
    return planning;
  }

  async update(id: number, updatePlanningDto: UpdatePlanningDto): Promise<Planning> {
    const planning = await this.findOne(id);
    Object.assign(planning, updatePlanningDto);
    return this.planningRepository.save(planning);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.planningRepository.delete(id);
  }
}
