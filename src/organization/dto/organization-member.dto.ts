import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AssignUserToOrgDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  organizationId: number;

  @IsOptional()
  @IsNumber()
  roleId?: number;
}

export class OrgMemberResponseDto {
  id: number;
  name: string;
  email: string;
  mobile: string;
  roleId: number;
  roleName: string;
  organizationId: number;
  canCreateUsers: boolean;
  isActive: boolean;
  createdAt: Date;
}

export class TeamStatsDto {
  totalMembers: number;
  membersByRole: Record<string, number>;
  activeUsers: number;
  inactiveUsers: number;
  usersThatCanCreateUsers: number;
}

export class OrganizationFullDto {
  id: number;
  name: string;
  type: string;
  division?: string;
  city?: string;
  thana?: string;
  wardNumber?: number;
  unitName?: string;
  parentId?: number;
  members: OrgMemberResponseDto[];
  children: OrganizationFullDto[];
  stats: TeamStatsDto;
}

export class AddMemberDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  roleId?: number;
}

export class CreateChildOrgDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  division?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  thana?: string;

  @IsOptional()
  @IsNumber()
  wardNumber?: number;

  @IsOptional()
  @IsString()
  unitName?: string;
}
