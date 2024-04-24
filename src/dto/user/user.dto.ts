import { IsEmail, IsNotEmpty, isNumber, isNumberString } from "class-validator";

export class UserDto {
    id: number;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    birthDate: Date;

    phone: string;
}