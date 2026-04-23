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
exports.MonthlyReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const monthly_report_entity_1 = require("./monthly-report.entity");
let MonthlyReportService = class MonthlyReportService {
    constructor(repo) {
        this.repo = repo;
    }
    async getByMonth(user, month) {
        return this.repo.findOne({ where: { user: { id: user.id }, month } });
    }
    async upsert(user, dto) {
        let report = await this.getByMonth(user, dto.month);
        if (!report) {
            report = this.repo.create({ user, month: dto.month });
        }
        Object.assign(report, {
            increaseAssociate: dto.increaseAssociate ?? report.increaseAssociate ?? [],
            increaseActivist: dto.increaseActivist ?? report.increaseActivist ?? [],
            increaseMember: dto.increaseMember ?? report.increaseMember ?? [],
            memorizingSura: dto.memorizingSura ?? report.memorizingSura ?? [],
            memorizingAyat: dto.memorizingAyat ?? report.memorizingAyat ?? [],
            memorizingHadits: dto.memorizingHadits ?? report.memorizingHadits ?? [],
            baitulmalIncreaseAmount: dto.baitulmalIncreaseAmount ?? report.baitulmalIncreaseAmount ?? 0,
            sellBooksNumber: dto.sellBooksNumber ?? report.sellBooksNumber ?? 0,
            socialHelp: dto.socialHelp ?? report.socialHelp ?? [],
            professionalHelp: dto.professionalHelp ?? report.professionalHelp ?? [],
        });
        return this.repo.save(report);
    }
};
exports.MonthlyReportService = MonthlyReportService;
exports.MonthlyReportService = MonthlyReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(monthly_report_entity_1.MonthlyReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MonthlyReportService);
//# sourceMappingURL=monthly-report.service.js.map