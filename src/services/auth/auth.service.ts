import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from 'src/dto/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/config/api.response';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async login(loginDto: LoginDto): Promise<any> {
        const user = await this.userService.findByEmail(loginDto.email);
        if(!user){
            return new ApiResponse(
                null,
                'User not exist',
                false,
                HttpStatus.UNAUTHORIZED
            )
        }

        const isMatchPassword = await bcrypt.compare(loginDto.password, user?.password);

        if (!isMatchPassword) {
            return new ApiResponse(
                null,
                'Password or email are incorect',
                false,
                HttpStatus.UNAUTHORIZED
            )
        }
        
        const payload = { 
            sub: user.id,
            email: user.email,
            username: user.username,
            slug: user.slug
        };
        
        return {
            access_token: await this.jwtService.sign(payload),
        };
    }
}
