import {IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ResetPasswordDto {
    @IsNotEmpty()
    @ApiProperty({ example: "dfdsfdsoiportufdfsf45sdfsdd", description: 'Token' })
    token: string;

    @IsNotEmpty()
    @ApiProperty({ example: "123456789", description: 'Mot de passe' })
    password: string;

    @IsNotEmpty()
    @ApiProperty({ example: "123456789", description: 'Mot de passe' })
    duplicatePassword: string;
}