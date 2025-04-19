import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res() res: Response) {
        const user = await this.authService.register(dto);
        return res.status(HttpStatus.CREATED).json({ message: 'User registered', user });
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const result = await this.authService.login(dto);
        if (!result) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Email atau Password anda salah !!' });
        }

        return res.status(HttpStatus.OK).json({
            message: 'Login successful',
            token: result.access_token,
            user: result.user,
        });
    }


}
