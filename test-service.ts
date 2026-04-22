import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MonthlyPlanService } from './src/monthly-plan/monthly-plan.service';
import { User } from './src/users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(MonthlyPlanService);
  const userRepository = app.get(getRepositoryToken(User));
  const user = await userRepository.findOne({ where: {} });
  if (!user) return console.log("No user");

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
  } catch (e) {
    console.error("UPSERT ERROR:", e);
  }
  await app.close();
}
bootstrap();
