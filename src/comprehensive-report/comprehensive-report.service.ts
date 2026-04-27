import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComprehensiveReport } from './comprehensive-report.entity';
import { CreateComprehensiveReportDto } from './dto/create-comprehensive-report.dto';
import { UpdateComprehensiveReportDto } from './dto/update-comprehensive-report.dto';

@Injectable()
export class ComprehensiveReportService {
  constructor(
    @InjectRepository(ComprehensiveReport)
    private reportRepository: Repository<ComprehensiveReport>,
  ) {}

  async createOrUpdate(createDto: CreateComprehensiveReportDto): Promise<ComprehensiveReport> {
    const existing = await this.reportRepository.findOne({
      where: {
        organizationId: createDto.organizationId,
        year: createDto.year,
        month: createDto.month,
      },
    });

    if (existing) {
      // Merge JSON objects rather than replacing them entirely
      const updated = {
        ...existing,
        ...createDto,
        headerInfo: { ...existing.headerInfo, ...createDto.headerInfo },
        unitDawat: { ...existing.unitDawat, ...createDto.unitDawat },
        personalDawat: { ...existing.personalDawat, ...createDto.personalDawat },
        generalMeeting: { ...existing.generalMeeting, ...createDto.generalMeeting },
        publicRelations: { ...existing.publicRelations, ...createDto.publicRelations },
        departmentalInfo: { ...existing.departmentalInfo, ...createDto.departmentalInfo },
        dawahPublication: { ...existing.dawahPublication, ...createDto.dawahPublication },
        finance: { ...existing.finance, ...createDto.finance },
        miscellaneous: { ...existing.miscellaneous, ...createDto.miscellaneous },
      };
      return this.reportRepository.save(updated);
    }

    const newReport = this.reportRepository.create(createDto);
    return this.reportRepository.save(newReport);
  }

  async findOne(organizationId: number, year: number, month: number): Promise<ComprehensiveReport> {
    return this.reportRepository.findOne({
      where: { organizationId, year, month },
    });
  }

  async update(id: number, updateDto: UpdateComprehensiveReportDto): Promise<ComprehensiveReport> {
    const existing = await this.reportRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    const updated = {
      ...existing,
      ...updateDto,
      headerInfo: { ...existing.headerInfo, ...updateDto.headerInfo },
      unitDawat: { ...existing.unitDawat, ...updateDto.unitDawat },
      personalDawat: { ...existing.personalDawat, ...updateDto.personalDawat },
      generalMeeting: { ...existing.generalMeeting, ...updateDto.generalMeeting },
      publicRelations: { ...existing.publicRelations, ...updateDto.publicRelations },
      departmentalInfo: { ...existing.departmentalInfo, ...updateDto.departmentalInfo },
      dawahPublication: { ...existing.dawahPublication, ...updateDto.dawahPublication },
      finance: { ...existing.finance, ...updateDto.finance },
      miscellaneous: { ...existing.miscellaneous, ...updateDto.miscellaneous },
    };
    
    return this.reportRepository.save(updated);
  }
}
