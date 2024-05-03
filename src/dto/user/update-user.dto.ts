import { IsDate, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: "John", description: 'Prénoms' })
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: "Doe", description: 'Prénoms' })
    lastName?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ example: "exemple@email.com", description: 'Email' })
    email?: string;

    @IsOptional()
    @IsDate()
    @ApiProperty({ example: "2024-05-15", description: 'Date de naissance' })
    birthDate?: Date;

    @IsOptional()
    @ApiProperty({ example: "+261348528956", description: 'Numero téléphone' })
    phone?: string;
}