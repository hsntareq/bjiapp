import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { PersonalReport } from './personal-report.entity';

@Injectable()
export class PersonalReportService {
  constructor(
    @InjectRepository(PersonalReport)
    private reportRepo: Repository<PersonalReport>,
  ) {}

  async createReport(
    user: User,
    data: Partial<PersonalReport>,
  ): Promise<PersonalReport> {
    const report = this.reportRepo.create({ ...data, user });
    return this.reportRepo.save(report);
  }

  async getReportsForUser(userId: number): Promise<PersonalReport[]> {
    return this.reportRepo.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });
  }

  async getReportByDate(
    userId: number,
    date: string,
  ): Promise<PersonalReport | undefined> {
    const result = await this.reportRepo.findOne({
      where: { user: { id: userId }, date },
    });
    return result ?? undefined;
  }
}
