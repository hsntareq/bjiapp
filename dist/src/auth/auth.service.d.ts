import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(data: {
        email?: string;
        mobile?: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    validateUserByEmail(email: string, pass: string): Promise<any>;
    validateUserByMobile(mobile: string, pass: string): Promise<any>;
    findOrCreateByGoogle(googleId: string, email: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
