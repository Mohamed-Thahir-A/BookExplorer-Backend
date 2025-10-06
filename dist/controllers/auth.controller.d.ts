import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: any;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: any;
        token: string;
    }>;
    getProfile(req: any): Promise<any>;
    verifyEmail(req: any): Promise<{
        message: string;
    }>;
}
