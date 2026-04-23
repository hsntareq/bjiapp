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
const personal_report_utils_1 = require("./personal-report.utils");
let PersonalReportService = class PersonalReportService {
    constructor(reportRepo) {
        this.reportRepo = reportRepo;
    }
    async findByUserAndDate(userId, date) {
        return this.reportRepo.findOne({
            where: { user: { id: userId }, date },
        });
    }
    normalizeReport(report) {
        report.salahJamaat = (0, personal_report_utils_1.normalizeSalahJamaat)(report.salahJamaat);
        const normalizedOrgWorkSeconds = (0, personal_report_utils_1.normalizeOrgWorkTotalSeconds)(report.orgWorkHours, report.orgWorkMinutes, report.orgWorkSeconds);
        Object.assign(report, (0, personal_report_utils_1.splitOrgWorkSeconds)(normalizedOrgWorkSeconds));
        return report;
    }
    async createReport(user, data) {
        const existingReport = data.date != null ? await this.findByUserAndDate(user.id, data.date) : null;
        const normalizedOrgWorkSeconds = (0, personal_report_utils_1.normalizeOrgWorkTotalSeconds)(data.orgWorkHours, data.orgWorkMinutes, data.orgWorkSeconds);
        const report = this.reportRepo.create({
            ...(existingReport ?? {}),
            ...data,
            ...(0, personal_report_utils_1.splitOrgWorkSeconds)(normalizedOrgWorkSeconds),
            salahJamaat: (0, personal_report_utils_1.normalizeSalahJamaat)(data.salahJamaat),
            user,
            orgWorkStartedAt: existingReport?.orgWorkStartedAt ?? null,
        });
        const savedReport = await this.reportRepo.save(report);
        return this.normalizeReport(savedReport);
    }
    async startOrgWorkTimer(user, date) {
        const existingReport = await this.findByUserAndDate(user.id, date);
        const report = this.reportRepo.create({
            ...(existingReport ?? {}),
            date,
            user,
            orgWorkStartedAt: existingReport?.orgWorkStartedAt ?? new Date(),
        });
        const savedReport = await this.reportRepo.save(report);
        return this.normalizeReport(savedReport);
    }
    async pauseOrgWorkTimer(user, date) {
        const report = await this.findByUserAndDate(user.id, date);
        if (!report) {
            const createdReport = this.reportRepo.create({
                date,
                user,
                orgWorkStartedAt: null,
            });
            const savedReport = await this.reportRepo.save(createdReport);
            return this.normalizeReport(savedReport);
        }
        if (report.orgWorkStartedAt) {
            const accumulatedSeconds = (0, personal_report_utils_1.normalizeOrgWorkTotalSeconds)(report.orgWorkHours, report.orgWorkMinutes, report.orgWorkSeconds);
            const elapsedSeconds = (0, personal_report_utils_1.getElapsedOrgWorkSeconds)(report.orgWorkStartedAt);
            Object.assign(report, (0, personal_report_utils_1.splitOrgWorkSeconds)(accumulatedSeconds + elapsedSeconds), {
                orgWorkStartedAt: null,
            });
        }
        const savedReport = await this.reportRepo.save(report);
        return this.normalizeReport(savedReport);
    }
    async getReportsForUser(userId) {
        return this.reportRepo.find({
            where: { user: { id: userId } },
            order: { date: 'DESC' },
        });
    }
    async getReportByDate(userId, date) {
        const result = await this.findByUserAndDate(userId, date);
        if (!result) {
            return undefined;
        }
        return this.normalizeReport(result);
    }
    async getMonthlySummary(userId, month) {
        const reports = await this.reportRepo.createQueryBuilder('report')
            .where('report.userId = :userId', { userId })
            .andWhere('report.date LIKE :month', { month: `${month}-%` })
            .getMany();
        const sum = {
            quranStudy: 0,
            haditsRead: 0,
            literature: 0,
            salahJamaat: 0,
            targetContactDawah: 0,
            targetContactWorker: 0,
            targetContactMember: 0,
            workerContact: 0,
            bookDistribution: 0,
            familyMeeting: 0,
            socialWork: 0,
            orgWorkTotalSeconds: 0,
            safar: 0,
            reportKeeping: 0,
            selfCriticism: 0,
        };
        for (const r of reports) {
            if (r.quranStudy)
                sum.quranStudy += 1;
            sum.haditsRead += r.haditsRead || 0;
            sum.literature += r.literature || 0;
            sum.salahJamaat += r.salahJamaat || 0;
            sum.targetContactDawah += r.targetContactDawah || 0;
            sum.targetContactWorker += r.targetContactWorker || 0;
            sum.targetContactMember += r.targetContactMember || 0;
            sum.workerContact += r.workerContact || 0;
            sum.bookDistribution += r.bookDistribution || 0;
            if (r.familyMeeting)
                sum.familyMeeting += 1;
            if (r.socialWork)
                sum.socialWork += 1;
            const seconds = (r.orgWorkHours || 0) * 3600 + (r.orgWorkMinutes || 0) * 60 + (r.orgWorkSeconds || 0);
            sum.orgWorkTotalSeconds += seconds;
            if (r.safar)
                sum.safar += 1;
            if (r.reportKeeping)
                sum.reportKeeping += 1;
            if (r.selfCriticism)
                sum.selfCriticism += 1;
        }
        return sum;
    }
};
exports.PersonalReportService = PersonalReportService;
exports.PersonalReportService = PersonalReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(personal_report_entity_1.PersonalReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PersonalReportService);
//# sourceMappingURL=personal-report.service.js.map