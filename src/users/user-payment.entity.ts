import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_payments')
@Unique(['user', 'year', 'month'])
export class UserPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @Column()
  year: number;

  @Column()
  month: number; // 1-12

  @Column({ name: 'allocated_nisab', type: 'integer', default: 0 })
  allocatedNisab: number;

  @Column({ name: 'direct_ianat', type: 'integer', default: 0 })
  directIanat: number;

  @Column({ name: 'one_time', type: 'integer', default: 0 })
  oneTime: number;

  @Column({ name: 'election_fund', type: 'integer', default: 0 })
  electionFund: number;

  @Column({ name: 'shahid_fund', type: 'integer', default: 0 })
  shahidFund: number;

  @Column({ name: 'flood_collection', type: 'integer', default: 0 })
  floodCollection: number;

  @Column({ name: 'social_work', type: 'integer', default: 0 })
  socialWork: number;

  @Column({ type: 'integer', default: 0 })
  zakat: number;

  @Column({ type: 'integer', default: 0 })
  fitra: number;

  @Column({ type: 'integer', default: 0 })
  iftar: number;

  @Column({ name: 'delegate_fee', type: 'integer', default: 0 })
  delegateFee: number;

  @Column({ name: 'total_paid', type: 'integer', default: 0 })
  totalPaid: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
