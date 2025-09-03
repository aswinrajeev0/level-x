// src/auth/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.token;

        if (!token) {
            throw new UnauthorizedException('Missing token');
        }

        try {
            const payload = this.jwtService.verify(token);
            request.user = payload;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
