import { IsDate, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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

    @ApiProperty({ example: "10", description: 'Limiter le nombre de resultat', required: false })
    @IsOptional()
    limit?: number;

    @ApiProperty({ example: "6", description: 'Aller à une page', required: false })
    @IsOptional()
    page?: number;
}