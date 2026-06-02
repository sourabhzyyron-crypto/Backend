import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
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

  async getAllUsers() {
    try {
      const users = await this.prismaService.user.findMany({
        where: { status: true },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });

      return {
        success: true,
        count: users.length,
        data: users,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
        },
      });

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
