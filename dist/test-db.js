"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const monthly_plan_entity_1 = require("./src/monthly-plan/monthly-plan.entity");
const user_entity_1 = require("./src/users/user.entity");
const personal_report_entity_1 = require("./src/personal-report/personal-report.entity");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_password,
    database: process.env.DB_DATABASE,
    entities: [monthly_plan_entity_1.MonthlyPlan, user_entity_1.User, personal_report_entity_1.PersonalReport],
    synchronize: false,
});
AppDataSource.initialize().then(async () => {
    console.log("DB connected");
    const repo = AppDataSource.getRepository(monthly_plan_entity_1.MonthlyPlan);
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const user = await userRepo.findOne({ where: {} });
    if (!user)
        return console.log("No user");
    try {
        const plan = repo.create({ month: "2026-05", user, increaseAssociate: [] });
        await repo.save(plan);
        console.log("Saved");
    }
    catch (e) {
        console.error("SAVE ERROR:", e);
    }
    process.exit(0);
}).catch(console.error);
//# sourceMappingURL=test-db.js.map