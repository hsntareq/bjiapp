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
exports.MonthlyPlanController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const monthly_plan_service_1 = require("./monthly-plan.service");
const monthly_plan_dto_1 = require("./dto/monthly-plan.dto");
const users_service_1 = require("../users/users.service");
let MonthlyPlanController = class MonthlyPlanController {
    constructor(service, usersService) {
        this.service = service;
        this.usersService = usersService;
    }
    async getPlan(req, month) {
        if (!req.user)
            throw new common_1.UnauthorizedException();
        const user = await this.usersService.findById(req.user.userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        return this.service.getByMonth(user, month);
    }
    async upsertPlan(req, dto) {
        if (!req.user)
            throw new common_1.UnauthorizedException();
        const user = await this.usersService.findById(req.user.userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        return this.service.upsert(user, dto);
    }
};
exports.MonthlyPlanController = MonthlyPlanController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MonthlyPlanController.prototype, "getPlan", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, monthly_plan_dto_1.UpsertMonthlyPlanDto]),
    __metadata("design:returntype", Promise)
], MonthlyPlanController.prototype, "upsertPlan", null);
exports.MonthlyPlanController = MonthlyPlanController = __decorate([
    (0, common_1.Controller)('monthly-plan'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [monthly_plan_service_1.MonthlyPlanService,
        users_service_1.UsersService])
], MonthlyPlanController);
//# sourceMappingURL=monthly-plan.controller.js.map