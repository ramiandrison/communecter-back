import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/user/user.module';
import { DataSource } from 'typeorm';
import { User } from './entities/user/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { TokenBlackList } from './entities/tokenBlackList/token.black-list';
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
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [User,TokenBlackList],
            synchronize: true,
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
