import { Repository } from 'typeorm';
import { MonthlyPlan } from './monthly-plan.entity';
import { User } from '../users/user.entity';
import { UpsertMonthlyPlanDto } from './dto/monthly-plan.dto';
export declare class MonthlyPlanService {
    private repo;
    constructor(repo: Repository<MonthlyPlan>);
    getByMonth(user: User, month: string): Promise<MonthlyPlan | null>;
    upsert(user: User, dto: UpsertMonthlyPlanDto): Promise<MonthlyPlan>;
}
