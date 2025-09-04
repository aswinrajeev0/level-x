import { BadRequestException, Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user-dto';
import type { Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) { }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        return this.usersService.createUser(dto);
    }

    @Post('login')
    async login(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        const loginResponse = await this.authService.login(user);

        res.cookie('token', loginResponse.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
        });

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    @Post("verify-otp")
    async verifyOtp(@Body() body: { email: string; otp: number }) {
        const isValid = await this.authService.verifyOtp(body.email, body.otp);
        if (!isValid) {
            throw new BadRequestException("Invalid OTP");
        }
        return { success: true };
    }

    @UseGuards(AuthGuard)
    @Post("logout")
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return { success: true, message: "Logged out successfully" };
    }
}
