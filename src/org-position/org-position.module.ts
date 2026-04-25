import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgPosition } from '../common/entities';
import { OrgPositionController } from './org-position.controller';
import { OrgPositionService } from './org-position.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrgPosition])],
  controllers: [OrgPositionController],
  providers: [OrgPositionService],
  exports: [OrgPositionService],
})
export class OrgPositionModule {}
