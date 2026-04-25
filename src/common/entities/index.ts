import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  type: string; // CENTRAL, CITY, THANA, WARD, UNIT

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

  @ManyToOne(() => Organization, (org) => org.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent: Organization;

  @Column({ nullable: true })
  parentId: number;

  @OneToMany(() => Organization, (org) => org.parent)
  children: Organization[];

  @OneToMany(() => Role, (role) => role.organization)
  roles: Role[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Organization, (org) => org.roles, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @Column()
  organizationId: number;

  @OneToMany(() => Permission, (perm) => perm.role, { cascade: true })
  permissions: Permission[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  resource: string; // e.g., 'users', 'activities', 'reports'

  @Column()
  action: string; // e.g., 'create', 'read', 'update', 'delete'

  @ManyToOne(() => Role, (role) => role.permissions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  role: Role;

  @Column({ nullable: true })
  roleId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

/**
 * Represents a member's position/role within a specific organization.
 * positionGroup: EXECUTIVE | SHURA | KORMO_PORISHODH | TEAM
 * positionTitle: President | Secretary | Baitulmal | etc.
 */
@Entity('org_positions')
export class OrgPosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', eager: false })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @ManyToOne(() => Organization, { nullable: true, onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization | null;

  @Column({ name: 'position_title', length: 100 })
  positionTitle: string;

  @Column({ name: 'position_group', length: 50 })
  positionGroup: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
