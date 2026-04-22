import { PersonalReport } from '../personal-report/personal-report.entity';
export declare class User {
    id: number;
    email: string;
    mobile: string;
    password: string;
    googleId: string;
    isActive: boolean;
    personalReports: PersonalReport[];
}
