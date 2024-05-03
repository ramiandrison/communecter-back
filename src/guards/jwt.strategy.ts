import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/services/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true, // Enable request object in validate 
        });
    }

    async validate(req: Request, payload: any) {
        const authorizationHeader = req.get('Authorization');
        const token = authorizationHeader ? authorizationHeader.split(' ')[1] : null;

        const isBlacklisted = await this.authService.isTokenBlacklisted(token);

        if (isBlacklisted) {
            return false
        }
        return payload
    }
}