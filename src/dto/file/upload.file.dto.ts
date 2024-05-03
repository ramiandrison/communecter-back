import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UploadFileDto {
    @ApiProperty({ example: "45", description: 'L\'utilisateur qui faif l\'upload' })
    @IsNotEmpty()
    userId: number;
}