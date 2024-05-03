import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from 'src/dto/email/send.email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {

    constructor(
        private readonly mailerService: MailerService,
        private configService: ConfigService,
    ) {}

    sendMail(sendEmailDto : SendEmailDto) {
        
        const emailPayload : any = {
            //from: this.configService.get<string>('EMAIL_SENDER'), Already declared in module
            to: sendEmailDto.to,
            subject: sendEmailDto.subject
        }

        if(sendEmailDto?.template){
            emailPayload.template = sendEmailDto.template
            if(sendEmailDto?.templateParams){
                emailPayload.context = sendEmailDto.templateParams
            }
        }else if(sendEmailDto?.html){
            emailPayload.html = sendEmailDto?.html
        }else if(sendEmailDto?.text){
            emailPayload.template= 'email-template',
            emailPayload.context = {
                content : sendEmailDto?.text
            }
        }

        this.mailerService.sendMail(emailPayload)
    }
}
