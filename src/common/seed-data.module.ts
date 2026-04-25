import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Organization, Permission, Role } from './entities';
import { SeedDataService } from './services/seed-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Role, Permission, User])],
  providers: [SeedDataService],
  exports: [SeedDataService],
})
export class SeedDataModule {}
