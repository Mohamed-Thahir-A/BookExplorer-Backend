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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../../entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async findWithFilters(filters) {
        const { search, minPrice, maxPrice, minRating, category, author, page = 1, limit = 12, } = filters;
        const query = this.productRepository.createQueryBuilder('product');
        if (search) {
            query.andWhere('(product.title LIKE :search OR product.description LIKE :search)', { search: `%${search}%` });
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
                minPrice: minPrice || 0,
                maxPrice: maxPrice || 999999,
            });
        }
        if (minRating !== undefined) {
            query.andWhere('product.rating >= :minRating', { minRating });
        }
        if (category) {
            query.andWhere('product.category = :category', { category });
        }
        if (author) {
            query.andWhere('product.author LIKE :author', { author: `%${author}%` });
        }
        const skip = (page - 1) * limit;
        const [products, total] = await query
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            products,
            total,
            page,
        };
    }
    async findAll() {
        return this.productRepository.find();
    }
    async findOne(id) {
        return this.productRepository.findOne({ where: { id } });
    }
    async create(product) {
        return this.productRepository.save(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map