import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDetail } from '../entities/product-detail.entity';

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
  ) {}

  async createOrUpdateDetail(productId: string, detailData: Partial<ProductDetail>) {
    const existing = await this.productDetailRepository.findOne({
      where: { product_id: productId },
    });

    if (existing) {
      await this.productDetailRepository.update(productId, detailData);
      return this.getDetailByProductId(productId);
    } else {
      const detail = this.productDetailRepository.create({
        product_id: productId,
        ...detailData,
      });
      return this.productDetailRepository.save(detail);
    }
  }

  async getDetailByProductId(productId: string) {
    return this.productDetailRepository.findOne({
      where: { product_id: productId },
      relations: ['product'],
    });
  }

  async updateRatings(productId: string, ratingsAvg: number, reviewsCount: number) {
    await this.productDetailRepository.update(productId, {
      ratings_avg: ratingsAvg,
      reviews_count: reviewsCount,
    });
  }

  async deleteByProductId(productId: string) {
    const result = await this.productDetailRepository.delete(productId);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Product detail with product ID ${productId} not found`);
    }
    
    return { message: 'Product detail deleted successfully' };
  }
}