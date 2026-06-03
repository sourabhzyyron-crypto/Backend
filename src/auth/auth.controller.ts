import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }
  @Post('register')
  register(@Body() createUserDto: RegisterDto) {
    return this.authService.registerUser(createUserDto);
  }
}
