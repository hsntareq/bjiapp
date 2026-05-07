import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgManagementService } from './org-management.service';
import { OrgManagementController } from './org-management.controller';
import { 
  OrganizationLevel, 
  Organization, 
  Position, 
  OrganizationPositionAssignment 
} from '../common/entities';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationLevel,
      Organization,
      Position,
      OrganizationPositionAssignment,
      User,
    ]),
  ],
  controllers: [OrgManagementController],
  providers: [OrgManagementService],
  exports: [OrgManagementService],
})
export class OrgManagementModule {}
