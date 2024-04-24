import { IsDate, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}