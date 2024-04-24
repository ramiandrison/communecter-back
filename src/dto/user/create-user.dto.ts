import { IsDate, IsEmail, IsNotEmpty, IsOptional, isPhoneNumber } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsDate()
    birthDate: Date;

    @IsOptional()
    phone: string;
}