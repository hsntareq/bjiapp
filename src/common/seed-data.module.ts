import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UserPayment } from '../users/user-payment.entity';
import { Organization, OrgPosition, Permission, Role } from './entities';
import { SeedDataService } from './services/seed-data.service';
import { SeedKhilgaonService } from './services/seed-khilgaon.service';
import { SeedOmsUsersService } from './services/seed-oms-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Role, Permission, User, OrgPosition, UserPayment])],
  providers: [SeedDataService, SeedKhilgaonService, SeedOmsUsersService],
  exports: [SeedDataService, SeedKhilgaonService, SeedOmsUsersService],
})
export class SeedDataModule {}
