import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization, OrganizationLevel } from '../common/entities';
import { User } from '../users/user.entity';
import { RoleGuard } from '../common/guards';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, OrganizationLevel])],
  controllers: [OrganizationController],
  providers: [OrganizationService, RoleGuard],
  exports: [OrganizationService, RoleGuard],
})
export class OrganizationModule {}
