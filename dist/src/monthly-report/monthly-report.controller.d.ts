import { MonthlyReportService } from './monthly-report.service';
import { UpsertMonthlyReportDto } from './dto/monthly-report.dto';
import { UsersService } from '../users/users.service';
export declare class MonthlyReportController {
    private readonly service;
    private readonly usersService;
    constructor(service: MonthlyReportService, usersService: UsersService);
    getReport(req: any, month: string): Promise<import("./monthly-report.entity").MonthlyReport | null>;
    upsertReport(req: any, dto: UpsertMonthlyReportDto): Promise<import("./monthly-report.entity").MonthlyReport>;
}
