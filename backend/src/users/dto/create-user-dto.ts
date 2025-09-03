import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(6)
    confirmPassword: string

    @IsString()
    role: "ADMIN" | "CUSTOMER" | "SELLER";
}
