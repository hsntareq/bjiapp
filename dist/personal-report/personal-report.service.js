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
exports.PersonalReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const personal_report_entity_1 = require("./personal-report.entity");
let PersonalReportService = class PersonalReportService {
    constructor(reportRepo) {
        this.reportRepo = reportRepo;
    }
    async createReport(user, data) {
        const report = this.reportRepo.create({ ...data, user });
        return this.reportRepo.save(report);
    }
    async getReportsForUser(userId) {
        return this.reportRepo.find({
            where: { user: { id: userId } },
            order: { date: 'DESC' },
        });
    }
    async getReportByDate(userId, date) {
        const result = await this.reportRepo.findOne({
            where: { user: { id: userId }, date },
        });
        return result ?? undefined;
    }
};
exports.PersonalReportService = PersonalReportService;
exports.PersonalReportService = PersonalReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(personal_report_entity_1.PersonalReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PersonalReportService);
//# sourceMappingURL=personal-report.service.js.map