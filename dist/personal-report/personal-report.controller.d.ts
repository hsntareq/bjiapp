import { UsersService } from '../users/users.service';
import { CreatePersonalReportDto } from './dto/create-personal-report.dto';
import { PersonalReportTimerDto } from './dto/personal-report-timer.dto';
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
    }, body: CreatePersonalReportDto): Promise<PersonalReport>;
    startTimer(req: {
        user: {
            userId: number;
            username: string;
        };
    }, body: PersonalReportTimerDto): Promise<PersonalReport>;
    pauseTimer(req: {
        user: {
            userId: number;
            username: string;
        };
    }, body: PersonalReportTimerDto): Promise<PersonalReport>;
    getForUser(req: {
        user: {
            userId: number;
            username: string;
        };
    }, date?: string): Promise<PersonalReport | null>;
}
