import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyPlan } from './monthly-plan.entity';
import { User } from '../users/user.entity';
import { UpsertMonthlyPlanDto } from './dto/monthly-plan.dto';

@Injectable()
export class MonthlyPlanService {
  constructor(
    @InjectRepository(MonthlyPlan)
    private repo: Repository<MonthlyPlan>,
  ) {}

  async getByMonth(user: User, month: string): Promise<MonthlyPlan | null> {
    return this.repo.findOne({ where: { user: { id: user.id }, month } });
  }

  async upsert(user: User, dto: UpsertMonthlyPlanDto): Promise<MonthlyPlan> {
    const existing = await this.getByMonth(user, dto.month);

    // Ensure arrays are strings or empty arrays properly
    const data = { ...dto };
    if (!data.socialHelp) data.socialHelp = [];
    if (!data.professionalHelp) data.professionalHelp = [];
    if (!data.increaseAssociate) data.increaseAssociate = [];
    if (!data.increaseActivist) data.increaseActivist = [];
    if (!data.increaseMember) data.increaseMember = [];
    if (!data.memorizingSura) data.memorizingSura = [];
    if (!data.memorizingAyat) data.memorizingAyat = [];
    if (!data.memorizingHadits) data.memorizingHadits = [];

    if (existing) {
      this.repo.merge(existing, data);
      return this.repo.save(existing);
    } else {
      const newPlan = this.repo.create({ ...data, user });
      return this.repo.save(newPlan);
    }
  }
}
