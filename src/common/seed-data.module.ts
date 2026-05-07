import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UserPayment } from '../users/user-payment.entity';
import { Organization, OrgPosition, Permission, Role, OrganizationLevel, Position, RolePermission } from './entities';
import { SeedDataService } from './services/seed-data.service';
import { SeedKhilgaonService } from './services/seed-khilgaon.service';
import { SeedOmsUsersService } from './services/seed-oms-users.service';
import { HierarchicalSeedService } from './services/hierarchical-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization, 
      Role, 
      Permission, 
      User, 
      OrgPosition, 
      UserPayment,
      OrganizationLevel,
      Position,
      RolePermission
    ])
  ],
  providers: [SeedDataService, SeedKhilgaonService, SeedOmsUsersService, HierarchicalSeedService],
  exports: [SeedDataService, SeedKhilgaonService, SeedOmsUsersService, HierarchicalSeedService],
})
export class SeedDataModule {}
