import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from '../controllers/products.controller';
import { ProductsService } from '../services/products.service';
import { ProductDetailService } from '../services/product-detail.service';
import { Product } from '../entities/product.entity';
import { ProductDetail } from '../entities/product-detail.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductDetail, ])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductDetailService],
  exports: [ProductsService, ProductDetailService],
})
export class ProductsModule {}