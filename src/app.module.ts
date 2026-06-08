import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BrandModule } from './brand/brand.module';
import { AttributeModule } from './attribute/attribute.module';
import { ProductModule } from './product/product.module';


@Module({
  imports: [UserModule, PrismaModule, CategoryModule, AuthModule, AdminModule, BrandModule, AttributeModule, ProductModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
