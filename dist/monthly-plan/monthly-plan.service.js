"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyPlanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const monthly_plan_entity_1 = require("./monthly-plan.entity");
let MonthlyPlanService = class MonthlyPlanService {
    constructor(repo) {
        this.repo = repo;
    }
    async getByMonth(user, month) {
        return this.repo.findOne({ where: { user: { id: user.id }, month } });
    }
    async upsert(user, dto) {
        const existing = await this.getByMonth(user, dto.month);
        const data = { ...dto };
        if (!data.socialHelp)
            data.socialHelp = [];
        if (!data.professionalHelp)
            data.professionalHelp = [];
        if (!data.increaseAssociate)
            data.increaseAssociate = [];
        if (!data.increaseActivist)
            data.increaseActivist = [];
        if (!data.increaseMember)
            data.increaseMember = [];
        if (!data.memorizingSura)
            data.memorizingSura = [];
        if (!data.memorizingAyat)
            data.memorizingAyat = [];
        if (!data.memorizingHadits)
            data.memorizingHadits = [];
        if (existing) {
            this.repo.merge(existing, data);
            return this.repo.save(existing);
        }
        else {
            const newPlan = this.repo.create({ ...data, user });
            return this.repo.save(newPlan);
        }
    }
};
exports.MonthlyPlanService = MonthlyPlanService;
exports.MonthlyPlanService = MonthlyPlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(monthly_plan_entity_1.MonthlyPlan)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MonthlyPlanService);
//# sourceMappingURL=monthly-plan.service.js.map