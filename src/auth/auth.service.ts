import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  loginUser(dto: LoginDto) {
    return {
      email: dto.email,
      password: dto.password,
    };
  }
}
