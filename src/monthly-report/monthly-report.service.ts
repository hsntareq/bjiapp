import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyReport } from './monthly-report.entity';
import { User } from '../users/user.entity';
import { UpsertMonthlyReportDto } from './dto/monthly-report.dto';

@Injectable()
export class MonthlyReportService {
  constructor(
    @InjectRepository(MonthlyReport)
    private repo: Repository<MonthlyReport>,
  ) {}

  async getByMonth(user: User, month: string): Promise<MonthlyReport | null> {
    return this.repo.findOne({ where: { user: { id: user.id }, month } });
  }

  async upsert(user: User, dto: UpsertMonthlyReportDto): Promise<MonthlyReport> {
    let report = await this.getByMonth(user, dto.month);
    if (!report) {
      report = this.repo.create({ user, month: dto.month });
    }

    Object.assign(report, {
      increaseAssociate: dto.increaseAssociate ?? report.increaseAssociate ?? [],
      increaseActivist: dto.increaseActivist ?? report.increaseActivist ?? [],
      increaseMember: dto.increaseMember ?? report.increaseMember ?? [],
      memorizingSura: dto.memorizingSura ?? report.memorizingSura ?? [],
      memorizingAyat: dto.memorizingAyat ?? report.memorizingAyat ?? [],
      memorizingHadits: dto.memorizingHadits ?? report.memorizingHadits ?? [],
      baitulmalIncreaseAmount: dto.baitulmalIncreaseAmount ?? report.baitulmalIncreaseAmount ?? 0,
      sellBooksNumber: dto.sellBooksNumber ?? report.sellBooksNumber ?? 0,
      socialHelp: dto.socialHelp ?? report.socialHelp ?? [],
      professionalHelp: dto.professionalHelp ?? report.professionalHelp ?? [],
    });

    return this.repo.save(report);
  }
}
