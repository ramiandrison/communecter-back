import { Module } from '@nestjs/common';

import { EmailController } from 'src/controllers/email/email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from 'src/services/email/email.service';
import { ConfigModule } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT),
                auth: {
                  user: process.env.EMAIL_USERNAME,
                  pass: process.env.EMAIL_PASSWORD
                }
            },
            defaults: {
                from: `"No Reply" <${process.env.EMAIL_SENDER}>`,
            },
            template: {
                dir: __dirname + '../../../../templates', // Ensure this path is correct
                adapter: new HandlebarsAdapter(), // Using Handlebars as the template engine
                options: {
                    strict: true,
                },
            },
        })
    ],
    providers: [
        EmailService
    ],
    controllers: [EmailController],
    exports: []
})

export class EmailModule {}
