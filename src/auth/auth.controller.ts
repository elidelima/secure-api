import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, Public } from './auth.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/role.enum';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: LoginDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @HttpCode(HttpStatus.OK)
    @Get('admin')
    @Roles(Role.Admin)
    create(@Request() req: Request) {
        return 'Hello admin';
    }
}
