import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Organization, OrgPosition, Permission, Role } from './entities';
import { SeedDataService } from './services/seed-data.service';
import { SeedKhilgaonService } from './services/seed-khilgaon.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Role, Permission, User, OrgPosition])],
  providers: [SeedDataService, SeedKhilgaonService],
  exports: [SeedDataService, SeedKhilgaonService],
})
export class SeedDataModule {}
