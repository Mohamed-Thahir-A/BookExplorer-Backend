"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../entities/review.entity");
const products_service_1 = require("./products.service");
const product_detail_service_1 = require("./product-detail.service");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, productsService, productDetailService) {
        this.reviewRepository = reviewRepository;
        this.productsService = productsService;
        this.productDetailService = productDetailService;
    }
    async create(reviewData) {
        if (reviewData.rating < 0.5 || reviewData.rating > 5) {
            throw new common_1.BadRequestException('Rating must be between 0.5 and 5');
        }
        const product = await this.productsService.findOne(reviewData.product_id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${reviewData.product_id} not found`);
        }
        const review = this.reviewRepository.create(reviewData);
        const savedReview = await this.reviewRepository.save(review);
        await this.updateProductRating(reviewData.product_id);
        return savedReview;
    }
    async findByProductId(productId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: { product_id: productId },
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });
        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateProductRating(productId) {
        const averageRating = await this.getAverageRating(productId);
        const reviewCount = await this.getReviewCount(productId);
        await this.productDetailService.updateRatings(productId, averageRating, reviewCount);
    }
    async getAverageRating(productId) {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .where('review.product_id = :productId', { productId })
            .getRawOne();
        return parseFloat(result.average) || 0;
    }
    async getReviewCount(productId) {
        return this.reviewRepository.count({ where: { product_id: productId } });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService,
        product_detail_service_1.ProductDetailService])
], ReviewsService);
//# sourceMappingURL=review.service.js.map