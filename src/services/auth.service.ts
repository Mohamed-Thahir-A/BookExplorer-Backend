import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto,  } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: any; token: string }> {
    const { email, password, first_name, last_name } = registerDto;

    
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
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

  async login(loginDto: LoginDto): Promise<{ user: any; token: string }> {
    const { email, password } = loginDto;

    
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    if (user.is_verified !== true) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

   
    const { password: _, ...userWithoutPassword } = user;
    const userResponse = {
      ...userWithoutPassword,
      fullName: `${user.first_name} ${user.last_name}`
    };

    
    const token = this.generateToken(user);

    return { user: userResponse, token };
  }




 
  async verifyResetToken(token: string): Promise<{ valid: boolean; message?: string }> {
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

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { verification_token: token } });
    
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    user.is_verified = true;
    user.verification_token = null;
    await this.userRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      fullName: `${user.first_name} ${user.last_name}`
    };
  }

  async validateUser(userId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  private generateToken(user: User): string {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role
    };
    return this.jwtService.sign(payload);
  }
}