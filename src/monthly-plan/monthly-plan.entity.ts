import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Unique(['user', 'month'])
export class MonthlyPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @Column()
  month!: string; // Format: "YYYY-MM"

  @Column({ default: 0 })
  quranStudyDays!: number;

  @Column({ default: 0 })
  haditsRead!: number;

  @Column({ default: 0 })
  literature!: number;

  @Column({ type: 'integer', default: 0 })
  salahJamaat!: number;

  @Column({ default: 0 })
  targetContactDawah!: number;

  @Column({ default: 0 })
  targetContactWorker!: number;

  @Column({ default: 0 })
  targetContactMember!: number;

  @Column({ default: 0 })
  workerContact!: number;

  @Column({ default: 0 })
  bookDistribution!: number;

  @Column({ default: 0 })
  familyMeetingDays!: number;

  @Column({ default: 0 })
  socialWorkDays!: number;

  @Column({ default: 0 })
  orgWorkHours!: number;

  @Column({ default: 0 })
  safarDays!: number;

  @Column({ default: 0 })
  reportKeepingDays!: number;

  @Column({ default: 0 })
  selfCriticismDays!: number;

  @Column({ type: 'simple-array', default: '' })
  increaseAssociate!: string[];

  @Column({ type: 'simple-array', default: '' })
  increaseActivist!: string[];

  @Column({ type: 'simple-array', default: '' })
  increaseMember!: string[];

  @Column({ type: 'simple-array', default: '' })
  memorizingSura!: string[];

  @Column({ type: 'simple-array', default: '' })
  memorizingAyat!: string[];

  @Column({ type: 'simple-array', default: '' })
  memorizingHadits!: string[];

  @Column({ default: 0 })
  baitulmalIncreaseAmount!: number;

  @Column({ default: 0 })
  sellBooksNumber!: number;

  @Column({ type: 'simple-array', default: '' })
  socialHelp!: string[];

  @Column({ type: 'simple-array', default: '' })
  professionalHelp!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
