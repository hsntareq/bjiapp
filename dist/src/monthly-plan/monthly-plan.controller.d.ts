import { MonthlyPlanService } from './monthly-plan.service';
import { UpsertMonthlyPlanDto } from './dto/monthly-plan.dto';
import { UsersService } from '../users/users.service';
export declare class MonthlyPlanController {
    private readonly service;
    private readonly usersService;
    constructor(service: MonthlyPlanService, usersService: UsersService);
    getPlan(req: any, month: string): Promise<import("./monthly-plan.entity").MonthlyPlan | null>;
    upsertPlan(req: any, dto: UpsertMonthlyPlanDto): Promise<import("./monthly-plan.entity").MonthlyPlan>;
}
