import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async registerUser(createUserDto: RegisterDto) {
    const { name, email, phone, password } = createUserDto;

    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prismaService.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          status: true,
        },
      });

      const { password: _, ...result } = user;

      return {
        success: true,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Something went wrong while creating the user',
      );
    }
  }
  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (!user.status) {
        throw new UnauthorizedException('Your account has been deactivated');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },
        access_token: accessToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error(error);

      throw new InternalServerErrorException(
        'Something went wrong while logging in',
      );
    }
  }
}
