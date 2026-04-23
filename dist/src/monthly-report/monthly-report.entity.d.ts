import { User } from '../users/user.entity';
export declare class MonthlyReport {
    id: number;
    user: User;
    month: string;
    increaseAssociate: string[];
    increaseActivist: string[];
    increaseMember: string[];
    memorizingSura: string[];
    memorizingAyat: string[];
    memorizingHadits: string[];
    baitulmalIncreaseAmount: number;
    sellBooksNumber: number;
    socialHelp: string[];
    professionalHelp: string[];
    createdAt: Date;
    updatedAt: Date;
}
