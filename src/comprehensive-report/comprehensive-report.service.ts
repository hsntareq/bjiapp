import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ComprehensiveReport } from './comprehensive-report.entity';
import { Organization } from '../common/entities';
import { CreateComprehensiveReportDto } from './dto/create-comprehensive-report.dto';
import { UpdateComprehensiveReportDto } from './dto/update-comprehensive-report.dto';
import { aggregateReports, aggregateJson } from './comprehensive-report.utils';

@Injectable()
export class ComprehensiveReportService {
  constructor(
    @InjectRepository(ComprehensiveReport)
    private reportRepository: Repository<ComprehensiveReport>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
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
        prCampaign: { ...existing.prCampaign, ...createDto.prCampaign },
        programs: { ...existing.programs, ...createDto.programs },
        manpower: { ...existing.manpower, ...createDto.manpower },
        deptManpower: { ...existing.deptManpower, ...createDto.deptManpower },
        unitStats: { ...existing.unitStats, ...createDto.unitStats },
        studentJoining: { ...existing.studentJoining, ...createDto.studentJoining },
        safar: { ...existing.safar, ...createDto.safar },
        donors: { ...existing.donors, ...createDto.donors },
        orgMeetings: { ...existing.orgMeetings, ...createDto.orgMeetings },
        training: { ...existing.training, ...createDto.training },
        socialWork: { ...existing.socialWork, ...createDto.socialWork },
        political: { ...existing.political, ...createDto.political },
        baitulmal: { ...existing.baitulmal, ...createDto.baitulmal },
        organizationData: { ...existing.organizationData, ...createDto.organizationData },
        dawah: { ...existing.dawah, ...createDto.dawah },
        remarks: { ...existing.remarks, ...createDto.remarks },
      };
      return this.reportRepository.save(updated);
    }

    const newReport = this.reportRepository.create(createDto);
    return this.reportRepository.save(newReport);
  }

  async findOne(organizationId: number, year: number, month: number): Promise<any> {
    const org = await this.orgRepository.findOne({
      where: { id: organizationId },
      relations: ['children'],
    });

    if (!org) {
      throw new NotFoundException(`Organization with ID ${organizationId} not found`);
    }

    const ownReport = await this.reportRepository.findOne({
      where: { organizationId, year, month },
    });

    // If it's a UNIT, just return its own report
    if (org.type === 'UNIT') {
      return ownReport || null;
    }

    // If it's WARD or higher, aggregate from children
    const childOrgs = org.children || [];
    
    if (childOrgs.length === 0) {
      return ownReport || null;
    }

    // To get a full aggregate, we should fetch reports for all descendants that are units, 
    // OR fetch child reports and hope they are already aggregated.
    // The user said: "multiple unit report belongs to a ward and the calculation of unit report is the report of a ward per month"
    // "similarly multiple ward report belongs to a thana..."
    
    // Let's implement a helper to get all unit descendant IDs
    const getAllUnitDescendantIds = async (id: number): Promise<number[]> => {
      const children = await this.orgRepository.find({ where: { parentId: id } });
      let unitIds: number[] = [];
      for (const child of children) {
        if (child.type === 'UNIT') {
          unitIds.push(child.id);
        } else {
          const nested = await getAllUnitDescendantIds(child.id);
          unitIds = unitIds.concat(nested);
        }
      }
      return unitIds;
    };

    const unitIds = await getAllUnitDescendantIds(organizationId);

    if (unitIds.length === 0) {
      return ownReport || null;
    }

    // Fetch reports for all descendant units
    const descendantReports = await this.reportRepository.find({
      where: {
        organizationId: In(unitIds),
        year,
        month,
      },
    });

    const aggregatedData = aggregateReports(descendantReports);

    if (!ownReport) {
      return {
        organizationId,
        year,
        month,
        ...aggregatedData,
      };
    }

    // Merge own report (adjustments/extra data) with aggregated data
    const mergedReport = {
      ...ownReport,
    };

    const sections = [
      'headerInfo', 'unitDawat', 'personalDawat', 'generalMeeting',
      'publicRelations', 'prCampaign', 'departmentalInfo', 'dawahPublication',
      'programs', 'manpower', 'deptManpower', 'unitStats', 'studentJoining',
      'safar', 'donors', 'orgMeetings', 'training', 'socialWork',
      'political', 'finance', 'baitulmal', 'organizationData', 'dawah',
      'miscellaneous', 'remarks', 'unitOrganization'
    ];

    for (const section of sections) {
        if (aggregatedData[section] || ownReport[section]) {
            mergedReport[section] = aggregateJson(aggregatedData[section] || {}, ownReport[section] || {});
        }
    }

    return mergedReport;
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
      prCampaign: { ...existing.prCampaign, ...updateDto.prCampaign },
      programs: { ...existing.programs, ...updateDto.programs },
      manpower: { ...existing.manpower, ...updateDto.manpower },
      deptManpower: { ...existing.deptManpower, ...updateDto.deptManpower },
      unitStats: { ...existing.unitStats, ...updateDto.unitStats },
      studentJoining: { ...existing.studentJoining, ...updateDto.studentJoining },
      safar: { ...existing.safar, ...updateDto.safar },
      donors: { ...existing.donors, ...updateDto.donors },
      orgMeetings: { ...existing.orgMeetings, ...updateDto.orgMeetings },
      training: { ...existing.training, ...updateDto.training },
      socialWork: { ...existing.socialWork, ...updateDto.socialWork },
      political: { ...existing.political, ...updateDto.political },
      baitulmal: { ...existing.baitulmal, ...updateDto.baitulmal },
      organizationData: { ...existing.organizationData, ...updateDto.organizationData },
      dawah: { ...existing.dawah, ...updateDto.dawah },
      remarks: { ...existing.remarks, ...updateDto.remarks },
    };
    
    return this.reportRepository.save(updated);
  }
}
