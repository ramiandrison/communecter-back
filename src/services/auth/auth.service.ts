import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dto/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { MESSAGE_EXPIRED_TOKEN, MESSAGE_TWO_PASSWORD_NOT_EQUAL, MESSAGE_USER_NEED_ACTIVATION, MESSAGE_USER_NOT_FOUND, MESSAGE_WRONG_PASSWORD } from 'src/constants/view-model';
import { TokenBlackList } from 'src/entities/tokenBlackList/token-black-list.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from 'src/dto/auth/reset-password.dto';
import { ChangePasswordDto } from 'src/dto/auth/change-password.dto';
import { ActiveAccountDto } from 'src/dto/auth/active-account.dto';
import { User } from 'src/entities/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(TokenBlackList)
        private tokenRepository: Repository<TokenBlackList>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private emailService: EmailService,
    ){}

    async login(loginDto: LoginDto): Promise<any> {
        const user = await this.usersRepository.findOneBy({ email: loginDto.email });
        if(!user){
            throw new NotFoundException(null, MESSAGE_USER_NOT_FOUND); 
        }
        if(!user.activated){
            throw new UnauthorizedException(null, MESSAGE_USER_NEED_ACTIVATION);
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
        const user = await this.usersRepository.findOneBy({email});
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
        await this.usersRepository.save(user);

        this.emailService.sendMail({
            "to": user.email,
            "subject" : "Reset password",
            "template" : "reset-password",
            "templateParams" : {
               "token" : resetPasswordToken
            }
        })
    }

    //Reset password if forget
    async resetPassword(resetPasswordDto : ResetPasswordDto): Promise<any>{
        const user = await this.usersRepository.findOneBy({resetPasswordToken: resetPasswordDto.token});
        if (!user) {
            throw new NotFoundException(null, MESSAGE_USER_NOT_FOUND);
        }

        const userData = await this.verifyToken(resetPasswordDto.token);
        
        if(userData){
            if(resetPasswordDto.password !== resetPasswordDto.duplicatePassword){
                throw new UnauthorizedException(null,MESSAGE_TWO_PASSWORD_NOT_EQUAL)
            }
            const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = null;
            await this.usersRepository.save(user);
        }
    }

    //Change password if you want to change it
    async changePassword(changePasswordDto: ChangePasswordDto, userId : number): Promise<any>{
        const user = await this.usersRepository.findOneBy({id: userId});
        if (!user) {
            throw new NotFoundException(null, MESSAGE_USER_NOT_FOUND);
        }

        if(!user.activated){
            throw new UnauthorizedException(null, MESSAGE_USER_NEED_ACTIVATION);
        }

        const isMatch = await bcrypt.compare(changePasswordDto.currentPassword, user?.password);
        if (!isMatch) {
            throw new UnauthorizedException(null, MESSAGE_WRONG_PASSWORD);
        }

        if(changePasswordDto.newPassword !== changePasswordDto.repeatPassword){
            throw new UnauthorizedException(null, MESSAGE_TWO_PASSWORD_NOT_EQUAL);
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.save(user);
        return ;
    }

    //login not pass here (only activation token and reset password token)
    async verifyToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
        } catch (e) {
            throw new UnauthorizedException(null,MESSAGE_EXPIRED_TOKEN)
        }
    }

    async activeAccount(activeAccountDto : ActiveAccountDto): Promise<any>{
        const user = await this.usersRepository.findOneBy({activationToken: activeAccountDto.token});
        if (!user) {
            throw new NotFoundException(null, MESSAGE_USER_NOT_FOUND);
        }

        const userData = await this.verifyToken(activeAccountDto.token);
        
        if(userData){
            user.activated = true;
            user.activationToken = null;
            await this.usersRepository.save(user);
        }
    }
}
