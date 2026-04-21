import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email?: string; mobile?: string; password: string },
  ) {
    return this.authService.register(body);
  }

  @Post('login-email')
  async loginWithEmail(
    @Body() body: { email: string; password: string },
  ): Promise<unknown> {
    const user: unknown = await this.authService.validateUserByEmail(
      body.email,
      body.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('login-mobile')
  async loginWithMobile(
    @Body() body: { mobile: string; password: string },
  ): Promise<unknown> {
    const user: unknown = await this.authService.validateUserByMobile(
      body.mobile,
      body.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('google')
  async loginWithGoogle(
    @Body() body: { googleId: string; email: string },
  ): Promise<unknown> {
    if (!body.googleId) {
      throw new HttpException('googleId is required', HttpStatus.BAD_REQUEST);
    }
    const user: unknown = await this.authService.findOrCreateByGoogle(
      body.googleId,
      body.email,
    );
    return this.authService.login(user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth redirect — handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const token = await this.authService.login(req.user);
    // Redirect to the frontend with the JWT as a query param
    res.redirect(
      `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/dashboard?token=${token.access_token}`,
    );
  }
}
