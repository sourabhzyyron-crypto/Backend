import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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

  // async updateUser(id: number, updateUserDto: UpdateUserDto) {
  //   try {
  //     const existingUser = await this.prismaService.user.findUnique({
  //       where: { id },
  //     });

  //     if (!existingUser) {
  //       throw new NotFoundException(`User with ID ${id} not found`);
  //     }

  //     const updatedUser = await this.prismaService.user.update({
  //       where: { id },
  //       data: updateUserDto,
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         phone: true,
  //         status: true,
  //       },
  //     });

  //     return {
  //       success: true,
  //       message: 'User updated successfully',
  //       data: updatedUser,
  //     };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }

  //     throw new InternalServerErrorException('Failed to update user');
  //   }
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
