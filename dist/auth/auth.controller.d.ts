import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: Record<string, any>): Promise<any>;
    getProfile(req: any): any;
    create(req: Request): string;
}
