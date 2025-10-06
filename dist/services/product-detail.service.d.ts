import { Repository } from 'typeorm';
import { ProductDetail } from '../entities/product-detail.entity';
export declare class ProductDetailService {
    private productDetailRepository;
    constructor(productDetailRepository: Repository<ProductDetail>);
    createOrUpdateDetail(productId: string, detailData: Partial<ProductDetail>): Promise<ProductDetail>;
    getDetailByProductId(productId: string): Promise<ProductDetail>;
    updateRatings(productId: string, ratingsAvg: number, reviewsCount: number): Promise<void>;
    deleteByProductId(productId: string): Promise<{
        message: string;
    }>;
}
