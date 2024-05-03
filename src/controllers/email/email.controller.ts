import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
//import { GetUser } from 'src/decorators/user.connected';
import { LoginDto } from 'src/dto/auth/login.dto';
import { AuthService } from 'src/services/auth/auth.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { EmailService } from 'src/services/email/email.service';
import { SendEmailDto } from 'src/dto/email/send.email.dto';

@Controller()
export class EmailController {
    constructor(private emailService: EmailService){}

    @Public()
    @Post('sendmail')
    @ApiOperation({ summary: 'Envoyer un email' })
    @ApiBearerAuth()
    send(@Body() sendEmailDto: SendEmailDto){
        return this.emailService.sendMail(sendEmailDto);
    }
}
