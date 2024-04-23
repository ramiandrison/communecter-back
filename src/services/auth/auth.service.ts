import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from 'src/dto/auth/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async signIn(loginDto: LoginDto): Promise<{ token: string }> {
        const user = await this.userService.findByEmail(loginDto.email);
        if (user?.password !== loginDto.password) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.email };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
