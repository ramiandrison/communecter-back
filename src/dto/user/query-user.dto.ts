import { IsDate, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class QueryUserDto {
    @IsOptional()
    @IsNotEmpty()
    firstName: string;

    @IsOptional()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsDate()
    birthDate: Date;

    @IsOptional()
    phone: string;

    @IsOptional()
    limit?: number;

    @IsOptional()
    page?: number;
}