import { Repository } from 'typeorm';
import { MonthlyReport } from './monthly-report.entity';
import { User } from '../users/user.entity';
import { UpsertMonthlyReportDto } from './dto/monthly-report.dto';
export declare class MonthlyReportService {
    private repo;
    constructor(repo: Repository<MonthlyReport>);
    getByMonth(user: User, month: string): Promise<MonthlyReport | null>;
    upsert(user: User, dto: UpsertMonthlyReportDto): Promise<MonthlyReport>;
}
