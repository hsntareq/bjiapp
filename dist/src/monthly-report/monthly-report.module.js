"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyReportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const monthly_report_entity_1 = require("./monthly-report.entity");
const monthly_report_controller_1 = require("./monthly-report.controller");
const monthly_report_service_1 = require("./monthly-report.service");
const users_module_1 = require("../users/users.module");
let MonthlyReportModule = class MonthlyReportModule {
};
exports.MonthlyReportModule = MonthlyReportModule;
exports.MonthlyReportModule = MonthlyReportModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([monthly_report_entity_1.MonthlyReport]), users_module_1.UsersModule],
        providers: [monthly_report_service_1.MonthlyReportService],
        controllers: [monthly_report_controller_1.MonthlyReportController],
    })
], MonthlyReportModule);
//# sourceMappingURL=monthly-report.module.js.map