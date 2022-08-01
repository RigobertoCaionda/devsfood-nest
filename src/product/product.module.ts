import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/services/prisma.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/services/category.service';

@Module({
  controllers: [ProductController, CategoryController],
  providers: [ProductService, PrismaService, CategoryService],
})
export class ProductModule {}
