import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ProductsService } from './products.service';
import { ProductDetailService } from './product-detail.service';
export declare class ReviewsService {
    private reviewRepository;
    private productsService;
    private productDetailService;
    constructor(reviewRepository: Repository<Review>, productsService: ProductsService, productDetailService: ProductDetailService);
    create(reviewData: Partial<Review>): Promise<Review>;
    findByProductId(productId: string, page?: number, limit?: number): Promise<{
        reviews: Review[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    private updateProductRating;
    private getAverageRating;
    private getReviewCount;
}
