import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email?: string; mobile?: string; password: string }) {
    return this.authService.register(body);
  }

  @Post('login-email')
  async loginWithEmail(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUserByEmail(body.email, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('login-mobile')
  async loginWithMobile(@Body() body: { mobile: string; password: string }) {
    const user = await this.authService.validateUserByMobile(body.mobile, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  // Google login endpoint will be added here
}
