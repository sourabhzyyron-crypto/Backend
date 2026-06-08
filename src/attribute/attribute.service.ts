import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttributeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAttribute(createAttributeDto: CreateAttributeDto) {
    try {
      const { categoryId, name, value, price, offerPrice, status } =
        createAttributeDto;

      const category = await this.prismaService.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const existingAttribute = await this.prismaService.attribute.findFirst({
        where: {
          categoryId,
          name,
          value,
        },
      });

      if (existingAttribute) {
        throw new BadRequestException(
          'Attribute already exists in this category',
        );
      }

      const attribute = await this.prismaService.attribute.create({
        data: {
          categoryId,
          name,
          value,
          price,
          offerPrice,
          status: status ?? true,
        },
      });

      return {
        success: true,
        message: 'Attribute created successfully',
        data: attribute,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create attribute');
    }
  }

  async getAllAttributes() {
    try {
      const attributes = await this.prismaService.attribute.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!attributes.length) {
        throw new NotFoundException('No attributes found');
      }

      return {
        success: true,
        message: 'Attributes fetched successfully',
        data: attributes,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch attributes');
    }
  }

  async getAttributeById(id: number) {
    try {
      const attribute = await this.prismaService.attribute.findUnique({
        where: {
          id,
        },
        include: {
          category: true,
        },
      });

      if (!attribute) {
        throw new NotFoundException(`Attribute with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Attribute fetched successfully',
        data: attribute,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch attribute');
    }
  }

  async updateAttribute(id: number, updateAttributeDto: UpdateAttributeDto) {
    try {
      const existingAttribute = await this.prismaService.attribute.findUnique({
        where: { id },
      });

      if (!existingAttribute) {
        throw new NotFoundException(`Attribute with ID ${id} not found`);
      }

      if (
        updateAttributeDto.categoryId &&
        updateAttributeDto.categoryId !== existingAttribute.categoryId
      ) {
        const category = await this.prismaService.category.findUnique({
          where: {
            id: updateAttributeDto.categoryId,
          },
        });

        if (!category) {
          throw new BadRequestException('Category does not exist');
        }
      }

      const updatedAttribute = await this.prismaService.attribute.update({
        where: {
          id,
        },
        data: {
          ...updateAttributeDto,
        },
      });

      return {
        success: true,
        message: 'Attribute updated successfully',
        data: updatedAttribute,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update attribute');
    }
  }
  async removeAttribute(id: number) {
    try {
      const attribute = await this.prismaService.attribute.findUnique({
        where: { id },
      });

      if (!attribute) {
        throw new NotFoundException(`Attribute with ID ${id} not found`);
      }

      const deletedAttribute = await this.prismaService.attribute.update({
        where: { id },
        data: {
          status: false,
        },
      });

      return {
        success: true,
        message: 'Attribute deleted successfully',
        data: deletedAttribute,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete attribute');
    }
  }

  async findAttributesByCategoryId(categoryId: number) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      const attributes = await this.prismaService.attribute.findMany({
        where: {
          categoryId,
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        message: 'Attributes fetched successfully',
        count: attributes.length,
        data: attributes,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch attributes');
    }
  }
}
