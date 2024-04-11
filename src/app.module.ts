import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/modules/user.module';
import { DataSource } from 'typeorm';
import { User } from './users/entities/use.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: "mysql",
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [User],
          synchronize: true,
        }),
        UsersModule
      ],
      controllers: [
        AppController
      ],
      providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
