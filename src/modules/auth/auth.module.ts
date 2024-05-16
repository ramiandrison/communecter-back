import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersModule } from '../user/user.module';
import { UserService } from 'src/services/user/user.service';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { AuthService } from 'src/services/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlackList } from 'src/entities/tokenBlackList/token-black-list.entity';
import { EmailService } from 'src/services/email/email.service';
import { User } from 'src/entities/user/user.entity';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        TypeOrmModule.forFeature([TokenBlackList, User]),
        JwtModule.register({}),
        //Commented because login and count activation and reset password token have different expiration (See authService)
        /*JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: '15m' },
          }),
          inject: [ConfigService],
        }),*/
    ],
    providers: [
        AuthService,
        EmailService,
        JwtStrategy,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        }
    ],
    controllers: [AuthController],
    exports: [
        AuthService
    ]
})

export class AuthModule {}
