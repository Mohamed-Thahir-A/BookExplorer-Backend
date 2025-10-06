"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, first_name, last_name } = registerDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            verification_token: null,
            is_verified: true,
        });
        const savedUser = await this.userRepository.save(user);
        const { password: _, ...userWithoutPassword } = savedUser;
        const userResponse = {
            ...userWithoutPassword,
            fullName: `${savedUser.first_name} ${savedUser.last_name}`
        };
        const token = this.generateToken(savedUser);
        return { user: userResponse, token };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.is_verified !== true) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { password: _, ...userWithoutPassword } = user;
        const userResponse = {
            ...userWithoutPassword,
            fullName: `${user.first_name} ${user.last_name}`
        };
        const token = this.generateToken(user);
        return { user: userResponse, token };
    }
    async verifyResetToken(token) {
        const user = await this.userRepository.findOne({
            where: {
                reset_password_token: token,
            },
        });
        if (!user) {
            return { valid: false, message: 'Invalid token' };
        }
        if (!user.reset_password_expires || user.reset_password_expires < new Date()) {
            return { valid: false, message: 'Token has expired' };
        }
        return { valid: true, message: 'Token is valid' };
    }
    async verifyEmail(token) {
        const user = await this.userRepository.findOne({ where: { verification_token: token } });
        if (!user) {
            throw new common_1.NotFoundException('Invalid verification token');
        }
        user.is_verified = true;
        user.verification_token = null;
        await this.userRepository.save(user);
        return { message: 'Email verified successfully' };
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password: _, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            fullName: `${user.first_name} ${user.last_name}`
        };
    }
    async validateUser(userId) {
        return await this.userRepository.findOne({ where: { id: userId } });
    }
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map