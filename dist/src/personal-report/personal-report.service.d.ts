import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { PersonalReport } from './personal-report.entity';
export declare class PersonalReportService {
    private reportRepo;
    constructor(reportRepo: Repository<PersonalReport>);
    private findByUserAndDate;
    private normalizeReport;
    createReport(user: User, data: Partial<PersonalReport>): Promise<PersonalReport>;
    startOrgWorkTimer(user: User, date: string): Promise<PersonalReport>;
    pauseOrgWorkTimer(user: User, date: string): Promise<PersonalReport>;
    getReportsForUser(userId: number): Promise<PersonalReport[]>;
    getReportByDate(userId: number, date: string): Promise<PersonalReport | undefined>;
    getMonthlySummary(userId: number, month: string): Promise<{
        quranStudy: number;
        haditsRead: number;
        literature: number;
        salahJamaat: number;
        targetContactDawah: number;
        targetContactWorker: number;
        targetContactMember: number;
        workerContact: number;
        bookDistribution: number;
        familyMeeting: number;
        socialWork: number;
        orgWorkTotalSeconds: number;
        safar: number;
        reportKeeping: number;
        selfCriticism: number;
    }>;
}
