import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, isPhoneNumber } from "class-validator";


export class CreateUserDto {
    @ApiProperty({ example: "John", description: 'Prénoms' })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: "Doe", description: 'Prénoms' })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: "exemple@email.com", description: 'Email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "hlhuihdqsdhqksd", description: 'Mot de passe' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: "2024-05-15", description: 'Date de naissance' })
    @IsOptional()
    @IsDate()
    birthDate: Date;

    @ApiProperty({ example: "+2613485289", description: 'Numero téléphone' })
    @IsOptional()
    phone: string;
}