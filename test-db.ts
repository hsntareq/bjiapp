import { DataSource } from 'typeorm';
import { MonthlyPlan } from './src/monthly-plan/monthly-plan.entity';
import { User } from './src/users/user.entity';
import { PersonalReport } from './src/personal-report/personal-report.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_password,
  database: process.env.DB_DATABASE,
  entities: [MonthlyPlan, User, PersonalReport],
  synchronize: false,
});

AppDataSource.initialize().then(async () => {
  console.log("DB connected");
  const repo = AppDataSource.getRepository(MonthlyPlan);
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: {} });
  if (!user) return console.log("No user");
  try {
    const plan = repo.create({ month: "2026-05", user, increaseAssociate: [] });
    await repo.save(plan);
    console.log("Saved");
  } catch(e) {
    console.error("SAVE ERROR:", e);
  }
  process.exit(0);
}).catch(console.error);
