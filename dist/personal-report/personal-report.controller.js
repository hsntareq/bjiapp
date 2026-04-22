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
exports.PersonalReportController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("../users/users.service");
const create_personal_report_dto_1 = require("./dto/create-personal-report.dto");
const personal_report_timer_dto_1 = require("./dto/personal-report-timer.dto");
const personal_report_service_1 = require("./personal-report.service");
let PersonalReportController = class PersonalReportController {
    constructor(reportService, usersService) {
        this.reportService = reportService;
        this.usersService = usersService;
    }
    async create(req, body) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.reportService.createReport(user, body);
    }
    async startTimer(req, body) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.reportService.startOrgWorkTimer(user, body.date);
    }
    async pauseTimer(req, body) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.reportService.pauseOrgWorkTimer(user, body.date);
    }
    async getForUser(req, date) {
        const useDate = date || new Date().toISOString().slice(0, 10);
        const report = await this.reportService.getReportByDate(req.user.userId, useDate);
        return report ?? null;
    }
};
exports.PersonalReportController = PersonalReportController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_personal_report_dto_1.CreatePersonalReportDto]),
    __metadata("design:returntype", Promise)
], PersonalReportController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('timer/start'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, personal_report_timer_dto_1.PersonalReportTimerDto]),
    __metadata("design:returntype", Promise)
], PersonalReportController.prototype, "startTimer", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('timer/pause'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, personal_report_timer_dto_1.PersonalReportTimerDto]),
    __metadata("design:returntype", Promise)
], PersonalReportController.prototype, "pauseTimer", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PersonalReportController.prototype, "getForUser", null);
exports.PersonalReportController = PersonalReportController = __decorate([
    (0, common_1.Controller)('personal-report'),
    __metadata("design:paramtypes", [personal_report_service_1.PersonalReportService,
        users_service_1.UsersService])
], PersonalReportController);
//# sourceMappingURL=personal-report.controller.js.map