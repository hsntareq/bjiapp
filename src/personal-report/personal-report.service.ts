import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { PersonalReport } from './personal-report.entity';
import {
  getElapsedOrgWorkSeconds,
  normalizeOrgWorkTotalSeconds,
  normalizeSalahJamaat,
  splitOrgWorkSeconds,
} from './personal-report.utils';

@Injectable()
export class PersonalReportService {
  constructor(
    @InjectRepository(PersonalReport)
    private reportRepo: Repository<PersonalReport>,
  ) {}

  private async findByUserAndDate(userId: number, date: string): Promise<PersonalReport | null> {
    return this.reportRepo.findOne({
      where: { user: { id: userId }, date },
    });
  }

  private normalizeReport(report: PersonalReport): PersonalReport {
    report.salahJamaat = normalizeSalahJamaat(report.salahJamaat);
    const normalizedOrgWorkSeconds = normalizeOrgWorkTotalSeconds(
      report.orgWorkHours,
      report.orgWorkMinutes,
      report.orgWorkSeconds,
    );
    Object.assign(report, splitOrgWorkSeconds(normalizedOrgWorkSeconds));
    return report;
  }

  async createReport(user: User, data: Partial<PersonalReport>): Promise<PersonalReport> {
    const existingReport =
      data.date != null ? await this.findByUserAndDate(user.id, data.date) : null;
    const normalizedOrgWorkSeconds = normalizeOrgWorkTotalSeconds(
      data.orgWorkHours,
      data.orgWorkMinutes,
      data.orgWorkSeconds,
    );

    const report = this.reportRepo.create({
      ...(existingReport ?? {}),
      ...data,
      ...splitOrgWorkSeconds(normalizedOrgWorkSeconds),
      salahJamaat: normalizeSalahJamaat(data.salahJamaat),
      user,
      orgWorkStartedAt: existingReport?.orgWorkStartedAt ?? null,
    });
    const savedReport = await this.reportRepo.save(report);
    return this.normalizeReport(savedReport);
  }

  async startOrgWorkTimer(user: User, date: string): Promise<PersonalReport> {
    const existingReport = await this.findByUserAndDate(user.id, date);
    const report = this.reportRepo.create({
      ...(existingReport ?? {}),
      date,
      user,
      orgWorkStartedAt: existingReport?.orgWorkStartedAt ?? new Date(),
    });
    const savedReport = await this.reportRepo.save(report);
    return this.normalizeReport(savedReport);
  }

  async pauseOrgWorkTimer(user: User, date: string): Promise<PersonalReport> {
    const report = await this.findByUserAndDate(user.id, date);
    if (!report) {
      const createdReport = this.reportRepo.create({
        date,
        user,
        orgWorkStartedAt: null,
      });
      const savedReport = await this.reportRepo.save(createdReport);
      return this.normalizeReport(savedReport);
    }

    if (report.orgWorkStartedAt) {
      const accumulatedSeconds = normalizeOrgWorkTotalSeconds(
        report.orgWorkHours,
        report.orgWorkMinutes,
        report.orgWorkSeconds,
      );
      const elapsedSeconds = getElapsedOrgWorkSeconds(report.orgWorkStartedAt);
      Object.assign(report, splitOrgWorkSeconds(accumulatedSeconds + elapsedSeconds), {
        orgWorkStartedAt: null,
      });
    }

    const savedReport = await this.reportRepo.save(report);
    return this.normalizeReport(savedReport);
  }

  async getReportsForUser(userId: number): Promise<PersonalReport[]> {
    return this.reportRepo.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });
  }

  async getReportByDate(userId: number, date: string): Promise<PersonalReport | undefined> {
    const result = await this.findByUserAndDate(userId, date);
    if (!result) {
      return undefined;
    }
    return this.normalizeReport(result);
  }
}
