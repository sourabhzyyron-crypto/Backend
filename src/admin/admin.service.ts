import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
      where: {
        role: 'user',
      },
    });

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: updateAdminDto,
    });

    return {
      success: true,
      message: 'User updated successfully',
      data: user,
    };
  }

  async remove(id: number) {
    const user = await this.prismaService.user.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'User deleted successfully',
      data: user,
    };
  }
}
