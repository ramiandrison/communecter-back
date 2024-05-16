import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/user/user.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmailModule } from './modules/email/email.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),  // Adjust this path as needed, Allow getting file from URL
            serveRoot: process.env.MULTER_DEST,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: configService.get<'mysql' | 'postgres'>('DATABASE_TYPE'),
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT', 5432),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                ssl: {
                    rejectUnauthorized: false, // For self-signed certificates
                },
            }),
            inject: [ConfigService],
        }),
        UsersModule, 
        AuthModule,
        FileModule,
        EmailModule
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService
    ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
