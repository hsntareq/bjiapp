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
    }): Promise<{
        access_token: string;
    }>;
    loginWithMobile(body: {
        mobile: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    loginWithGoogle(body: {
        googleId: string;
        email: string;
    }): Promise<{
        access_token: string;
    }>;
}
