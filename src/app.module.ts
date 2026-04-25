import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { SeedDataModule } from './common/seed-data.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MonthlyPlanModule } from './monthly-plan/monthly-plan.module';
import { MonthlyReportModule } from './monthly-report/monthly-report.module';
import { OrganizationModule } from './organization/organization.module';
import { OrgPositionModule } from './org-position/org-position.module';
import { PersonalReportModule } from './personal-report/personal-report.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT', '5432'), 10),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        // Connection pooling to prevent query conflicts
        poolSize: 10,
        connectionLimit: 20,
        // Prevent deprecated pg query warnings
        extra: {
          max: 20,
          connectionTimeoutMillis: 5000,
        },
      }),
    }),
    SeedDataModule,
    AuthModule,
    UsersModule,
    OrganizationModule,
    OrgPositionModule,
    PersonalReportModule,
    MonthlyPlanModule,
    MonthlyReportModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
