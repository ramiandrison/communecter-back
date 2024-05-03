import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";


export class SendEmailDto {
    @ApiProperty({ example: "exemple.jdd@gmail.com", description: 'Destinataire' })
    @IsNotEmpty()
    to: string;

    @ApiProperty({ example: "Doe", description: 'Objet' })
    @IsNotEmpty()
    subject: string;

    @ApiProperty({ example: "Hello, my name is Bob", description: 'Texte', required: false })
    @IsOptional()
    text?: string;

    @ApiProperty({ example: "<h1>Hello<h1>", description: 'HTML', required: false  })
    @IsOptional()
    html?: string;

    @IsOptional()
    template?: string;

    @IsOptional()
    templateParams?: any;
}