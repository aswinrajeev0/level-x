import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return { id: user.id, email: user.email, name: user.name };
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: { id: string; email: string; name: string }) {
        const payload = { id: user.id, email: user.email };

        return {
            success: true,
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                // expiresIn: process.env.JWT_EXPIRES_IN,
            }),
            ...user,
        };
    }

    async verifyOtp(email: string, otp: number) {
        const MOCK_OTP = 987654;
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException("User with this email already exists")
        }

        if (otp === MOCK_OTP) {
            return {
                success: true
            }
        } else {
            return {
                success: false,
                message: ""
            }
        }
    }
}
