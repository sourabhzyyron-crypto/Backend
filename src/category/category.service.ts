import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, imageUrl, status } = createCategoryDto;

    // Check if category already exists
    const existingCategory = await this.prismaService.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new BadRequestException(`Category '${name}' already exists`);
    }

    // Create category
    const category = await this.prismaService.category.create({
      data: {
        name,
        imageUrl,
        status: status ?? true,
      },
    });

    return {
      success: true,
      message: 'Category created successfully',
      data: category,
    };
  }

  async getAllCategories() {
    try {
      const categories = await this.prismaService.category.findMany({
        where: {
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        message: 'Categories fetched successfully',
        count: categories.length,
        data: categories,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findCategoryById(id: number) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Category fetched successfully',
        data: category,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check duplicate name if name is being updated
    if (updateCategoryDto.name) {
      const existingCategory = await this.prismaService.category.findFirst({
        where: {
          name: updateCategoryDto.name,
          NOT: {
            id,
          },
        },
      });

      if (existingCategory) {
        throw new BadRequestException('Category name already exists');
      }
    }

    const updatedCategory = await this.prismaService.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
      },
    });

    return {
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  // removeCategory(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
