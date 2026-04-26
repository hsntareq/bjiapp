import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user === null ? undefined : user;
  }

  async findByMobile(mobile: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { mobile } });
    return user === null ? undefined : user;
  }

  async findByGoogleId(googleId: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { googleId } });
    return user === null ? undefined : user;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user === null ? undefined : user;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['role'],
    });
  }
}
