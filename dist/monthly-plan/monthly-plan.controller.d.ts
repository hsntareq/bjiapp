import { MonthlyPlanService } from './monthly-plan.service';
import { UpsertMonthlyPlanDto } from './dto/monthly-plan.dto';
export declare class MonthlyPlanController {
    private readonly service;
    constructor(service: MonthlyPlanService);
    getPlan(req: any, month: string): Promise<import("./monthly-plan.entity").MonthlyPlan | null>;
    upsertPlan(req: any, dto: UpsertMonthlyPlanDto): Promise<import("./monthly-plan.entity").MonthlyPlan>;
}
