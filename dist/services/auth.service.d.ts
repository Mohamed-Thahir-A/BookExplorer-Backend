import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: any;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: any;
        token: string;
    }>;
    verifyResetToken(token: string): Promise<{
        valid: boolean;
        message?: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<any>;
    validateUser(userId: string): Promise<User>;
    private generateToken;
}
