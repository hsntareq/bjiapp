import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    // Only return id, name, email, and responsibility/role
    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user.id,
      fullname: user.name,
      email: user.email,
      responsibility: user.role ? user.role.name : null,
    }));
  }
}
