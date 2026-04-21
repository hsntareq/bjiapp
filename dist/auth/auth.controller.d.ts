import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email?: string;
        mobile?: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    loginWithEmail(body: {
        email: string;
        password: string;
    }): Promise<unknown>;
    loginWithMobile(body: {
        mobile: string;
        password: string;
    }): Promise<unknown>;
    loginWithGoogle(body: {
        googleId: string;
        email: string;
    }): Promise<unknown>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: Request, res: Response): Promise<void>;
}
