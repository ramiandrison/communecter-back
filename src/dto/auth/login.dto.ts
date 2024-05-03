import { IsDate, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: "gova2@gmail.com", description: 'Email' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ example: "123456789", description: 'Mot de passe' })
    password: string;
}