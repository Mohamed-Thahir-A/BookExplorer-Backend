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
exports.ProductDetailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_detail_entity_1 = require("../entities/product-detail.entity");
let ProductDetailService = class ProductDetailService {
    constructor(productDetailRepository) {
        this.productDetailRepository = productDetailRepository;
    }
    async createOrUpdateDetail(productId, detailData) {
        const existing = await this.productDetailRepository.findOne({
            where: { product_id: productId },
        });
        if (existing) {
            await this.productDetailRepository.update(productId, detailData);
            return this.getDetailByProductId(productId);
        }
        else {
            const detail = this.productDetailRepository.create({
                product_id: productId,
                ...detailData,
            });
            return this.productDetailRepository.save(detail);
        }
    }
    async getDetailByProductId(productId) {
        return this.productDetailRepository.findOne({
            where: { product_id: productId },
            relations: ['product'],
        });
    }
    async updateRatings(productId, ratingsAvg, reviewsCount) {
        await this.productDetailRepository.update(productId, {
            ratings_avg: ratingsAvg,
            reviews_count: reviewsCount,
        });
    }
    async deleteByProductId(productId) {
        const result = await this.productDetailRepository.delete(productId);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Product detail with product ID ${productId} not found`);
        }
        return { message: 'Product detail deleted successfully' };
    }
};
exports.ProductDetailService = ProductDetailService;
exports.ProductDetailService = ProductDetailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_detail_entity_1.ProductDetail)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductDetailService);
//# sourceMappingURL=product-detail.service.js.map