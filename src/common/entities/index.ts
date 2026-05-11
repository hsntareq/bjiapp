import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('organization_levels')
export class OrganizationLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'bn_name', nullable: true })
  bnName: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'hierarchy_order', default: 0 })
  hierarchyOrder: number;

  @OneToMany(() => Organization, (org) => org.level)
  organizations: Organization[];

  @OneToMany(() => Position, (pos) => pos.level)
  positions: Position[];
}

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization, (org) => org.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Organization;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne(() => OrganizationLevel, (level) => level.organizations)
  @JoinColumn({ name: 'organization_level_id' })
  level: OrganizationLevel;

  @Column({ name: 'organization_level_id', nullable: true })
  organizationLevelId: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  division: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  thana: string;

  @Column({ nullable: true, type: 'integer' })
  wardNumber: number;

  @Column({ nullable: true })
  unitName: string;

  @Column({ nullable: true })
  office: string;

  @Column()
  name: string;

  @Column({ name: 'bn_name', nullable: true })
  bnName: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  code: string;

  @OneToMany(() => Organization, (org) => org.parent)
  children: Organization[];

  @OneToMany('Role', 'organization')
  roles: any[];

  @OneToMany('OrganizationPositionAssignment', 'organization')
  assignments: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrganizationLevel, (level) => level.positions)
  @JoinColumn({ name: 'organization_level_id' })
  level: OrganizationLevel;

  @Column({ name: 'organization_level_id' })
  organizationLevelId: number;

  @Column()
  name: string;

  @Column({ name: 'bn_name', nullable: true })
  bnName: string;

  @Column()
  slug: string;

  @Column({ name: 'rank_order', default: 0 })
  rankOrder: number;

  @Column({ name: 'is_executive', default: false })
  isExecutive: boolean;

  @OneToMany('OrganizationPositionAssignment', 'position')
  assignments: any[];

  @OneToMany('RolePermission', 'position')
  rolePermissions: any[];
}

@Entity('organization_position_assignments')
export class OrganizationPositionAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @ManyToOne(() => Position, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ name: 'position_id', nullable: true })
  positionId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column({ name: 'assigned_by', nullable: true })
  assignedBy: number;

  @Column({ name: 'position_title', nullable: true })
  positionTitle: string;

  @Column({ name: 'position_group', nullable: true })
  positionGroup: string;

  @Column({ name: 'notes', nullable: true, type: 'text' })
  notes: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'start_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'bn_name', nullable: true })
  bnName: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Organization, (org) => org.roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @OneToMany('Permission', 'role', { cascade: true })
  permissions: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'bn_name', nullable: true })
  bnName: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  resource: string;

  @Column({ nullable: true })
  action: string;

  @ManyToOne(() => Role, (role) => role.permissions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @OneToMany('RolePermission', 'permission')
  rolePermissions: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Position, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ name: 'position_id' })
  positionId: number;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @Column({ name: 'permission_id' })
  permissionId: number;
}

export { OrganizationPositionAssignment as OrgPosition };
