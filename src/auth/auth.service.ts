import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: { email?: string; mobile?: string; password: string }) {
    if (!data.email && !data.mobile) {
      throw new HttpException('Email or mobile is required', HttpStatus.BAD_REQUEST);
    }
    if (data.email) {
      const existing = await this.usersRepository.findOne({ where: { email: data.email } });
      if (existing) {
        throw new HttpException('Email already registered', HttpStatus.CONFLICT);
      }
    }
    if (data.mobile) {
      const existing = await this.usersRepository.findOne({ where: { mobile: data.mobile } });
      if (existing) {
        throw new HttpException('Mobile already registered', HttpStatus.CONFLICT);
      }
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      email: data.email,
      mobile: data.mobile,
      password: hashedPassword,
    });
    const saved = await this.usersRepository.save(user);
    const { password, ...result } = saved;
    return this.login(result);
  }

  async validateUserByEmail(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByMobile(mobile: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { mobile } });
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByGoogle(googleId: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { googleId } });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email || user.mobile, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
