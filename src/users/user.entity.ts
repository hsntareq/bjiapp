import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ default: true })
  isActive: boolean;
  @OneToMany(() => PersonalReport, (report) => report.user)
  personalReports: PersonalReport[];
}
