import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Organization, Role } from '../common/entities';
import { PersonalReport } from '../personal-report/personal-report.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  mobile: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  role: Role;

  @Column({ nullable: true })
  roleId: number;

  @ManyToOne(() => Organization, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  organization: Organization;

  @Column({ nullable: true })
  organizationId: number;

  @Column({ default: false })
  canCreateUsers: boolean;

  @ManyToOne(() => User, (user) => user.createdUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  createdBy: User;

  @Column({ nullable: true })
  createdByUserId: number;

  @OneToMany(() => User, (user) => user.createdBy)
  createdUsers: User[];

  @OneToMany(() => PersonalReport, (report) => report.user)
  personalReports: PersonalReport[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
