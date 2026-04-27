import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Organization } from '../organization/organization.entity';

@Entity('plannings')
@Unique(['organization', 'year', 'month'])
export class Planning {
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

  // Dawat: Invitation people to organization and increase associate
  @Column({ default: 0 })
  dawatTarget: number;

  @Column({ default: 0 })
  dawatAchieved: number;

  // Activist: create activists by improving their quality
  @Column({ default: 0 })
  activistTarget: number;

  @Column({ default: 0 })
  activistAchieved: number;

  // Member: create members by improving their quality
  @Column({ default: 0 })
  memberTarget: number;

  @Column({ default: 0 })
  memberAchieved: number;

  // Program planning: type of program that will be created by the central organization
  @Column({ default: 0 })
  programTarget: number;

  @Column({ default: 0 })
  programAchieved: number;

  @Column({ type: 'text', nullable: true })
  programDetails: string;

  // Donation Collection
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  donationTarget: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  donationAchieved: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
