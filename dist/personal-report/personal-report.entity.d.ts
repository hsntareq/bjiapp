import { User } from '../users/user.entity';
export declare class PersonalReport {
    id: number;
    user: User;
    date: string;
    quranStudy: boolean;
    haditsRead: number;
    literature: number;
    salahJamaat: boolean;
    targetContactDawah: number;
    targetContactWorker: number;
    targetContactMember: number;
    workerContact: number;
    bookDistribution: number;
    familyMeeting: boolean;
    socialWork: boolean;
    orgWorkHours: number;
    orgWorkMinutes: number;
    safar: boolean;
    reportKeeping: boolean;
    selfCriticism: boolean;
    createdAt: Date;
}
