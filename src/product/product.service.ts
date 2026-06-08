import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const {
        name,
        slug,
        description,
        sku,
        price,
        offerPrice,
        imageUrl,
        categoryId,
        brandId,
        status,
      } = createProductDto;

      const category = await this.prismaService.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const brand = await this.prismaService.brand.findUnique({
        where: {
          id: brandId,
        },
      });

      if (!brand) {
        throw new NotFoundException('Brand not found');
      }

      const existingProduct = await this.prismaService.product.findFirst({
        where: {
          OR: [{ slug }, { sku }],
        },
      });

      if (existingProduct) {
        throw new BadRequestException(
          'Product with this slug or SKU already exists',
        );
      }

      const product = await this.prismaService.product.create({
        data: {
          name,
          slug,
          description,
          sku,
          price,
          offerPrice,
          imageUrl,
          categoryId,
          brandId,
          status: status ?? true,
        },
        include: {
          category: true,
          brand: true,
        },
      });

      return {
        success: true,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findAll() {
    console.log(this.prismaService);
    try {
      const products = await this.prismaService.product.findMany({
        where: {
          status: true,
        },
        include: {
          category: true,
          brand: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        count: products.length,
        message: 'Products fetched successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: {
          id,
        },
        include: {
          category: true,
          brand: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Product fetched successfully',
        data: product,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      if (updateProductDto.categoryId) {
        const category = await this.prismaService.category.findUnique({
          where: {
            id: updateProductDto.categoryId,
          },
        });

        if (!category) {
          throw new BadRequestException('Category not found');
        }
      }

      if (updateProductDto.brandId) {
        const brand = await this.prismaService.brand.findUnique({
          where: {
            id: updateProductDto.brandId,
          },
        });

        if (!brand) {
          throw new BadRequestException('Brand not found');
        }
      }

      if (updateProductDto.slug) {
        const existingSlug = await this.prismaService.product.findFirst({
          where: {
            slug: updateProductDto.slug,
            id: {
              not: id,
            },
          },
        });

        if (existingSlug) {
          throw new BadRequestException('Slug already exists');
        }
      }

      if (updateProductDto.sku) {
        const existingSku = await this.prismaService.product.findFirst({
          where: {
            sku: updateProductDto.sku,
            id: {
              not: id,
            },
          },
        });

        if (existingSku) {
          throw new BadRequestException('SKU already exists');
        }
      }

      const finalPrice = updateProductDto.price ?? product.price;

      const finalOfferPrice = updateProductDto.offerPrice ?? product.offerPrice;

      if (finalOfferPrice && finalOfferPrice > finalPrice) {
        throw new BadRequestException(
          'Offer price cannot be greater than price',
        );
      }

      const updatedProduct = await this.prismaService.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: true,
          brand: true,
        },
      });

      return {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      const deletedProduct = await this.prismaService.product.update({
        where: { id },
        data: {
          status: false,
        },
      });

      return {
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
