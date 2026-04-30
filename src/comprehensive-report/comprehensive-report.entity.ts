import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn, Unique
} from 'typeorm';
import { Organization } from '../organization/organization.entity';

@Entity('comprehensive_reports')
@Unique(['organizationId', 'year', 'month'])
export class ComprehensiveReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @Column()
  year: number;

  @Column()
  month: number;

  // Header info: president name, target population, etc.
  @Column({ type: 'jsonb', default: '{}' })
  headerInfo: Record<string, any>;

  // Section 1: Unit group-based dawat (ইউনিট নিয়মিত গ্রুপভিত্তিক দাওয়াত)
  @Column({ type: 'jsonb', default: '{}' })
  unitDawat: Record<string, any>;

  // Section 2: Activist & Karmi (রুকন ও কর্মীভিত্তিক দাওয়াত)
  @Column({ type: 'jsonb', default: '{}' })
  personalDawat: Record<string, any>;

  // Section 3: General / Sadaran Shava (সাধারণ সভা)
  @Column({ type: 'jsonb', default: '{}' })
  generalMeeting: Record<string, any>;

  // Section 4: Public Relations / Janasampark (জনসম্পর্ক)
  @Column({ type: 'jsonb', default: '{}' })
  publicRelations: Record<string, any>;

  @Column({ type: 'jsonb', default: '{}' })
  prCampaign: Record<string, any>;

  // Section 5: Departmental Info (বিভাগীয় তথ্য)
  @Column({ type: 'jsonb', default: '{}' })
  departmentalInfo: Record<string, any>;

  // Section 6: Dawah & Publication (দাওয়াহ ও প্রকাশনা)
  @Column({ type: 'jsonb', default: '{}' })
  dawahPublication: Record<string, any>;

  // Section: Programs (কর্মসূচি বাস্তবায়ন)
  @Column({ type: 'jsonb', default: '{}' })
  programs: Record<string, any>;

  // Section: Manpower (জনশক্তি)
  @Column({ type: 'jsonb', default: '{}' })
  manpower: Record<string, any>;

  @Column({ type: 'jsonb', default: '{}' })
  deptManpower: Record<string, any>;

  // Section: Unit Stats (দাওয়াতী ও পারিবারিক ইউনিট)
  @Column({ type: 'jsonb', default: '{}' })
  unitStats: Record<string, any>;

  // Section: Student Joining
  @Column({ type: 'jsonb', default: '{}' })
  studentJoining: Record<string, any>;

  // Section: Safar
  @Column({ type: 'jsonb', default: '{}' })
  safar: Record<string, any>;

  // Section: Donors
  @Column({ type: 'jsonb', default: '{}' })
  donors: Record<string, any>;

  // Section: Org Meetings
  @Column({ type: 'jsonb', default: '{}' })
  orgMeetings: Record<string, any>;

  // Section: Training
  @Column({ type: 'jsonb', default: '{}' })
  training: Record<string, any>;

  // Section: Social Work
  @Column({ type: 'jsonb', default: '{}' })
  socialWork: Record<string, any>;

  // Section: Political
  @Column({ type: 'jsonb', default: '{}' })
  political: Record<string, any>;

  // Section 7: Finance / Baitulmal (বাইতুলমাল)
  @Column({ type: 'jsonb', default: '{}' })
  finance: Record<string, any>;

  // Section 8: Miscellaneous (বিবিধ)
  @Column({ type: 'jsonb', default: '{}' })
  miscellaneous: Record<string, any>;

  // Section: Remarks
  @Column({ type: 'jsonb', default: '{}' })
  remarks: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
