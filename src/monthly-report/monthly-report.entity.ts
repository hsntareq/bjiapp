import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Unique(['user', 'month'])
export class MonthlyReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @Column()
  month!: string; // Format: "YYYY-MM"

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

  @UpdateDateColumn()
  updatedAt!: Date;
}
