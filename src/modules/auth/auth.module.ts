import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersModule } from '../user/user.module';
import { UserService } from 'src/services/user/user.service';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { AuthService } from 'src/services/auth/auth.service';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: '15m' },
          }),
          inject: [ConfigService],
        }),
    ],
    providers: [
        AuthService,
        UserService,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
    ],
    controllers: [AuthController],
    exports: [AuthService]
})

export class AuthModule {}
