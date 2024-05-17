import {IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ChangePasswordDto {
    @IsNotEmpty()
    @ApiProperty({ example: "123456789", description: 'Mot de passe actuel' })
    currentPassword: string;

    @IsNotEmpty()
    @ApiProperty({ example: "123456789", description: 'Nouveau mot de passe' })
    newPassword: string;

    @IsNotEmpty()
    @ApiProperty({ example: "123456789", description: 'Repeter le mot de passe' })
    repeatPassword: string;
}