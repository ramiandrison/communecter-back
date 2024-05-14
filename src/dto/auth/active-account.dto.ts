import {IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ActiveAccountDto {
    @IsNotEmpty()
    @ApiProperty({ example: "dfdsfdsoiportufdfsf45sdfsdd", description: 'Token' })
    token: string;
}