import { UsersService } from '../users/users.service';
import { PersonalReport } from './personal-report.entity';
import { PersonalReportService } from './personal-report.service';
export declare class PersonalReportController {
    private readonly reportService;
    private readonly usersService;
    constructor(reportService: PersonalReportService, usersService: UsersService);
    create(req: {
        user: {
            userId: number;
            username: string;
        };
    }, body: Partial<PersonalReport>): Promise<PersonalReport>;
    getForUser(req: {
        user: {
            userId: number;
            username: string;
        };
    }, date?: string): Promise<PersonalReport | null>;
}
