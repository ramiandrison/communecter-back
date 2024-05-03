import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { LoginDto } from 'src/dto/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { MESSAGE_EXPIRED_TOKEN, MESSAGE_TWO_PASSWORD_NOT_EQUAL, MESSAGE_USER_NOT_FOUND, MESSAGE_WRONG_PASSWORD } from 'src/constants/view-model';
import { TokenBlackList } from 'src/entities/tokenBlackList/token.black-list';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from 'src/dto/auth/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(TokenBlackList)
        private tokenRepository: Repository<TokenBlackList>,
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private emailService: EmailService,
    ){}

    async login(loginDto: LoginDto): Promise<any> {
        const user = await this.userService.findByEmail(loginDto.email);
        if(!user){
            throw new NotFoundException(null, MESSAGE_USER_NOT_FOUND); 
        }
        const isMatch = await bcrypt.compare(loginDto.password, user?.password);
        if (!isMatch) {
            throw new UnauthorizedException(null, MESSAGE_WRONG_PASSWORD);
        }
        
        const payload = { 
            sub: user.id,
            email: user.email,
            username: user.username,
            slug: user.slug
        };
        return {
            access_token: await this.jwtService.sign(payload,{
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1h', // Shorter expiration for login tokens
            }),
        };
    }

    async logout(token: string): Promise<any>{
        try {
            const newBlacklistToken = this.tokenRepository.create({
                token: token,
            });
            this.tokenRepository.save(newBlacklistToken)
        }catch (error) {
            throw new HttpException(error, HttpStatus.FORBIDDEN);
        }
    }

    async isTokenBlacklisted(token: string): Promise<boolean>{ 
        const blackListToken = await this.tokenRepository.findOneBy({
            token
        });
        return blackListToken ? true : false
    }

    async generateResetPasswordToken(email: string): Promise<void> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException(null, MESSAGE_USER_NOT_FOUND);
        }

        const payload = { 
            sub: user.id,
            email: user.email,
            username: user.username,
            slug: user.slug
        };

        const resetPasswordToken =  this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '5m', // Longer expiration for reset password tokens
        });
        user.resetPasswordToken = resetPasswordToken
        await this.userService.save(user);

        this.emailService.sendMail({
            "to": user.email,
            "subject" : "Reset password",
            "template" : "reset-password",
            "templateParams" : {
               "token" : resetPasswordToken
            }
        })
    }

    async resetPassword(resetPasswordDto : ResetPasswordDto): Promise<any>{
        const user = await this.userService.findByResetPassWordToken(resetPasswordDto.token);
        if (!user) {
            throw new NotFoundException(null, MESSAGE_USER_NOT_FOUND);
        }

        const userData = this.verifyToken(resetPasswordDto.token);
        if(userData){
            if(resetPasswordDto.password !== resetPasswordDto.duplicatePassword){
                throw new UnauthorizedException(MESSAGE_TWO_PASSWORD_NOT_EQUAL)
            }
            const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
            user.password = hashedPassword;
            await this.userService.save(user);
        }
    }

    //login not pass here (only activation token and reset password token)
    async verifyToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
        } catch (e) {
            throw new UnauthorizedException(MESSAGE_EXPIRED_TOKEN)
        }
    }
}
