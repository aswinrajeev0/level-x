import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user-dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(dto: CreateUserDto) {

        if(dto.password !== dto.confirmPassword) {
            throw new ConflictException("Password do not match")
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role,
                name: dto.name
            },
        });

        return { id: user.id, email: user.email, name: user.name };
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async updateUserRole(userId: string, role: 'CUSTOMER' | 'SELLER' | 'ADMIN') {
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    }

    async updateApprovalStatus(userId: string, isApproved: boolean) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isApproved },
        });
    }
}
