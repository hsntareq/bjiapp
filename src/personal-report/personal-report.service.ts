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

  async getMonthlySummary(userId: number, month: string) {
    const reports = await this.reportRepo.createQueryBuilder('report')
      .where('report.userId = :userId', { userId })
      .andWhere('report.date LIKE :month', { month: `${month}-%` })
      .getMany();

    const sum = {
      quranStudy: 0,
      haditsRead: 0,
      literature: 0,
      salahJamaat: 0,
      targetContactDawah: 0,
      targetContactWorker: 0,
      targetContactMember: 0,
      workerContact: 0,
      bookDistribution: 0,
      familyMeeting: 0,
      socialWork: 0,
      orgWorkTotalSeconds: 0,
      safar: 0,
      reportKeeping: 0,
      selfCriticism: 0,
    };

    for (const r of reports) {
      if (r.quranStudy) sum.quranStudy += 1;
      sum.haditsRead += r.haditsRead || 0;
      sum.literature += r.literature || 0;
      sum.salahJamaat += r.salahJamaat || 0;
      sum.targetContactDawah += r.targetContactDawah || 0;
      sum.targetContactWorker += r.targetContactWorker || 0;
      sum.targetContactMember += r.targetContactMember || 0;
      sum.workerContact += r.workerContact || 0;
      sum.bookDistribution += r.bookDistribution || 0;
      if (r.familyMeeting) sum.familyMeeting += 1;
      if (r.socialWork) sum.socialWork += 1;
      
      const seconds = (r.orgWorkHours || 0) * 3600 + (r.orgWorkMinutes || 0) * 60 + (r.orgWorkSeconds || 0);
      sum.orgWorkTotalSeconds += seconds;

      if (r.safar) sum.safar += 1;
      if (r.reportKeeping) sum.reportKeeping += 1;
      if (r.selfCriticism) sum.selfCriticism += 1;
    }

    return sum;
  }
}
