"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const monthly_plan_service_1 = require("./src/monthly-plan/monthly-plan.service");
const user_entity_1 = require("./src/users/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const service = app.get(monthly_plan_service_1.MonthlyPlanService);
    const userRepository = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    const user = await userRepository.findOne({ where: {} });
    if (!user)
        return console.log("No user");
    const dto = {
        month: "2026-05",
        quranStudyDays: 31,
        haditsRead: 100,
        literature: 300,
        salahJamaat: 155,
        targetContactDawah: 9,
        targetContactWorker: 3,
        targetContactMember: 4,
        workerContact: 3,
        bookDistribution: 10,
        familyMeetingDays: 31,
        socialWorkDays: 31,
        orgWorkHours: 90,
        safarDays: 31,
        reportKeepingDays: 31,
        selfCriticismDays: 31,
        increaseAssociate: [],
        increaseActivist: [],
        increaseMember: [],
        memorizingSura: [],
        memorizingAyat: [],
        memorizingHadits: [],
        baitulmalIncreaseAmount: 200,
        sellBooksNumber: 10,
        socialHelp: [],
        professionalHelp: [],
    };
    try {
        await service.upsert(user, dto);
        console.log("Upserted successfully");
    }
    catch (e) {
        console.error("UPSERT ERROR:", e);
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=test-service.js.map