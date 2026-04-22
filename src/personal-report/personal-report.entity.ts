import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class PersonalReport {
  @PrimaryGeneratedColumn()
  id!: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => User, (user) => user.personalReports, { eager: true })
  user!: User;

  @Column({ type: 'date' })
  date!: string;

  @Column({ default: false })
  quranStudy!: boolean;

  @Column({ default: 0 })
  haditsRead!: number;

  @Column({ default: 0 })
  literature!: number;

  @Column({ default: false })
  salahJamaat!: boolean;

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

  @Column({ default: false })
  familyMeeting!: boolean;

  @Column({ default: false })
  socialWork!: boolean;

  @Column({ default: 0 })
  orgWorkHours!: number;

  @Column({ default: 0 })
  orgWorkMinutes!: number;

  @Column({ default: false })
  safar!: boolean;

  @Column({ default: false })
  reportKeeping!: boolean;

  @Column({ default: false })
  selfCriticism!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
