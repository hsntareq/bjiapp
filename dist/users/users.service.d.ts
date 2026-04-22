import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findByEmail(email: string): Promise<User | undefined>;
    findByMobile(mobile: string): Promise<User | undefined>;
    findByGoogleId(googleId: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    create(user: Partial<User>): Promise<User>;
}
