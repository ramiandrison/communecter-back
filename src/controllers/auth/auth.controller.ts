import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Request } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
//import { GetUser } from 'src/decorators/user.connected';
import { LoginDto } from 'src/dto/auth/login.dto';
import { AuthService } from 'src/services/auth/auth.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/dto/auth/reset-password.dto';
import { GetUser } from 'src/decorators/user.connected';
import { ChangePasswordDto } from 'src/dto/auth/change-password.dto';
import { ActiveAccountDto } from 'src/dto/auth/active-account.dto';

@Controller()
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Authentification' })
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }

   // @Public()
    @Get('logout')
    @ApiOperation({ summary: 'Déconnection' })
    @ApiBearerAuth()
    logout(@Request() req){
        const token = req.headers.authorization?.split(' ')[1];
        if(token){
            return this.authService.logout(token);
        }
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('generateResetPasswordToken')
    @ApiOperation({ summary: 'Créer un token pour rejeter le mot de passe' })
    generateResetPasswordToken(@Body('email') email: string){
        return this.authService.generateResetPasswordToken(email);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('resetPassword')
    @ApiOperation({ summary: 'Rejeter le mot de passe si oublié' })
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Get('changePassword')
    @ApiOperation({ summary: 'Changer le mot de passe' })
    @ApiBearerAuth()
    changePassword(changePassword: ChangePasswordDto, @GetUser() user:any){
        // teto no farany
    }

    @Public()
    @Get('activeAccount')
    @ApiOperation({ summary: 'Activation de compte' })
    activeAccount(@Query() activeAccountDto: ActiveAccountDto){
        return this.authService.activeAccount(activeAccountDto);
    }
}
