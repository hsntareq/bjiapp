import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { PersonalReport } from './personal-report.entity';
export declare class PersonalReportService {
    private reportRepo;
    constructor(reportRepo: Repository<PersonalReport>);
    createReport(user: User, data: Partial<PersonalReport>): Promise<PersonalReport>;
    getReportsForUser(userId: number): Promise<PersonalReport[]>;
    getReportByDate(userId: number, date: string): Promise<PersonalReport | undefined>;
}
