import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/user.entity';
import { UserService } from '../../services/user/user.service';
import { UserController } from '../../controllers/user/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserParser } from 'src/parsers/user/user.parser';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule],
    providers: [
        UserService,
        UserParser,
    ],
    controllers: [
        UserController
    ],
    exports: [
        TypeOrmModule,
        UserService,
        UserParser
    ]
})
export class UsersModule {}