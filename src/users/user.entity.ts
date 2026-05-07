import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Organization, Role, OrganizationPositionAssignment } from '../common/entities';
import { PersonalReport } from '../personal-report/personal-report.entity';
import { UserPayment } from './user-payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true, name: 'phone' })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'bn_name', nullable: true })
  bnName: string;

  @Column({ name: 'fullname', nullable: true })
  fullname: string;

  @Column({ default: 'active' })
  status: string; // active, inactive, etc.

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

  // Base rank: member | activist | associate
  @Column({ nullable: true, default: 'member' })
  rank: string;

  // Advanced tag: marks an activist or associate as advanced (adv-activist / adv-associate)
  @Column({ name: 'is_adv', default: false })
  isAdv: boolean;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ name: 'monthly_baitulmal_amount', nullable: true, type: 'integer' })
  monthlyBaitulmalAmount: number;

  @Column({ name: 'yearly_donation_amount', nullable: true, type: 'integer' })
  yearlyDonationAmount: number;

  @Column({ name: 'knowledgebase_id', nullable: true, type: 'integer' })
  knowledgebaseId: number;

  @Column({ name: 'academic_qualifications', type: 'json', nullable: true })
  academicQualifications: any;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true })
  nid: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ name: 'job_title', nullable: true })
  jobTitle: string;

  @Column({ name: 'job_organization', nullable: true })
  jobOrganization: string;

  @Column({ name: 'office_address', nullable: true, type: 'text' })
  officeAddress: string;

  @Column({ name: 'is_monthly_baitulmal_paid', default: false })
  isMonthlyBaitulmalPaid: boolean;

  @Column({ name: 'yearly_donation_paid', default: 0, type: 'integer' })
  yearlyDonationPaid: number;

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

  @OneToMany(() => OrganizationPositionAssignment, (opa) => opa.user)
  assignments: OrganizationPositionAssignment[];

  @OneToMany(() => UserPayment, (payment) => payment.user)
  payments: UserPayment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
