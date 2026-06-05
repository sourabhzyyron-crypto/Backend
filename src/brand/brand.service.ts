import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prismaService: PrismaService) {}
  async createBrand(createBrandDto: CreateBrandDto) {
    const { name, imageUrl, status } = createBrandDto;

    const existingBrand = await this.prismaService.brand.findUnique({
      where: {
        name: name.trim(),
      },
    });

    if (existingBrand) {
      throw new BadRequestException('Brand already exists');
    }

    return await this.prismaService.brand.create({
      data: {
        name: name.trim(),
        imageUrl,
        status,
      },
    });
  }

  async getAllBrand() {
    try {
      return await this.prismaService.brand.findMany({
        where: {
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch brands');
    }
  }

  async getBrandById(id: number) {
    try {
      const brand = await this.prismaService.brand.findFirst({
        where: {
          id,
          status: true,
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!brand) {
        throw new NotFoundException(`Brand with ID ${id} not found`);
      }

      return brand;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch brand');
    }
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    // Check if brand exists
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    // Check duplicate name if name is being updated
    if (updateBrandDto.name) {
      const existingBrand = await this.prismaService.brand.findFirst({
        where: {
          name: updateBrandDto.name.trim(),
          NOT: {
            id,
          },
        },
      });

      if (existingBrand) {
        throw new BadRequestException('Brand name already exists');
      }
    }

    return this.prismaService.brand.update({
      where: { id },
      data: {
        ...(updateBrandDto.name && {
          name: updateBrandDto.name.trim(),
        }),
        ...(updateBrandDto.imageUrl && {
          imageUrl: updateBrandDto.imageUrl,
        }),
        ...(updateBrandDto.status !== undefined && {
          status: updateBrandDto.status,
        }),
      },
    });
  }

  async removeBrand(id: number) {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return this.prismaService.brand.update({
      where: { id },
      data: {
        status: false,
      },
    });
  }
}
