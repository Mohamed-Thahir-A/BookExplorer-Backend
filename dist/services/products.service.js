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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const product_detail_entity_1 = require("../entities/product-detail.entity");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(productRepository, productDetailRepository) {
        this.productRepository = productRepository;
        this.productDetailRepository = productDetailRepository;
        this.logger = new common_1.Logger(ProductsService_1.name);
        console.log('ProductsService initialized');
    }
    async findWithFilters(filters) {
        const { search, minPrice, maxPrice, minRating, category, author, page = 1, limit = 300, } = filters;
        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category');
        if (search) {
            query.andWhere('(product.title ILIKE :search OR product.description ILIKE :search OR product.author ILIKE :search)', { search: `%${search}%` });
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
                minPrice,
                maxPrice,
            });
        }
        else if (minPrice !== undefined) {
            query.andWhere('product.price >= :minPrice', { minPrice });
        }
        else if (maxPrice !== undefined) {
            query.andWhere('product.price <= :maxPrice', { maxPrice });
        }
        if (minRating !== undefined) {
            query.andWhere('product.rating >= :minRating', { minRating });
        }
        if (category) {
            query.andWhere('category.slug = :category', { category });
        }
        if (author) {
            query.andWhere('product.author ILIKE :author', { author: `%${author}%` });
        }
        const [products, total] = await query
            .take(limit)
            .orderBy('product.last_scraped_at', 'DESC')
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            products,
            total,
            page,
            totalPages,
        };
    }
    async findAll() {
        return await this.productRepository.find({
            relations: ['category'],
            order: { last_scraped_at: 'DESC' },
        });
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'detail', 'reviews']
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async addScrapedProducts(products) {
        const savedProducts = [];
        for (const productData of products) {
            try {
                const existingProduct = await this.productRepository.findOne({
                    where: [
                        { source_id: productData.source_id },
                        {
                            title: productData.title,
                            author: productData.author,
                            price: productData.price
                        }
                    ]
                });
                if (existingProduct) {
                    await this.productRepository.update(existingProduct.id, {
                        ...productData,
                        last_scraped_at: new Date()
                    });
                    const updatedProduct = await this.productRepository.findOne({
                        where: { id: existingProduct.id },
                        relations: ['category']
                    });
                    if (updatedProduct)
                        savedProducts.push(updatedProduct);
                }
                else {
                    const newProduct = this.productRepository.create(productData);
                    const saved = await this.productRepository.save(newProduct);
                    savedProducts.push(saved);
                }
            }
            catch (error) {
                this.logger.error(`Error saving scraped product: ${error.message}`);
            }
        }
        return savedProducts;
    }
    async create(product) {
        const newProduct = this.productRepository.create(product);
        return await this.productRepository.save(newProduct);
    }
    async getProductStats() {
        const totalProducts = await this.productRepository.count();
        const avgPriceResult = await this.productRepository
            .createQueryBuilder('product')
            .select('AVG(product.price)', 'avg')
            .getRawOne();
        const avgRatingResult = await this.productRepository
            .createQueryBuilder('product')
            .select('AVG(product.rating)', 'avg')
            .getRawOne();
        const topAuthors = await this.productRepository
            .createQueryBuilder('product')
            .select('product.author', 'author')
            .addSelect('COUNT(*)', 'count')
            .where('product.author IS NOT NULL')
            .groupBy('product.author')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();
        return {
            totalProducts,
            averagePrice: parseFloat(avgPriceResult?.avg) || 0,
            averageRating: parseFloat(avgRatingResult?.avg) || 0,
            topAuthors: topAuthors.map(item => ({
                author: item.author,
                count: parseInt(item.count)
            })),
        };
    }
    async findByCategorySlug(categorySlug, page = 1, limit = 12) {
        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('category.slug = :categorySlug', { categorySlug });
        const skip = (page - 1) * limit;
        const [products, total] = await query
            .skip(skip)
            .take(limit)
            .orderBy('product.last_scraped_at', 'DESC')
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        const category = products.length > 0 ? products[0].category : null;
        return {
            products,
            total,
            page,
            totalPages,
            category,
        };
    }
    async getProductsWithCategories() {
        return await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .orderBy('category.title', 'ASC')
            .addOrderBy('product.last_scraped_at', 'DESC')
            .getMany();
    }
    async searchProducts(searchTerm, page = 1, limit = 12) {
        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.title ILIKE :search', { search: `%${searchTerm}%` })
            .orWhere('product.author ILIKE :search', { search: `%${searchTerm}%` })
            .orWhere('product.description ILIKE :search', { search: `%${searchTerm}%` })
            .orWhere('category.title ILIKE :search', { search: `%${searchTerm}%` });
        const skip = (page - 1) * limit;
        const [products, total] = await query
            .skip(skip)
            .take(limit)
            .orderBy('product.last_scraped_at', 'DESC')
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            products,
            total,
            page,
            totalPages,
        };
    }
    async getFeaturedProducts(limit = 6) {
        return await this.productRepository.find({
            relations: ['category'],
            where: {
                rating: (0, typeorm_2.MoreThanOrEqual)(4)
            },
            order: {
                rating: 'DESC',
                review_count: 'DESC'
            },
            take: limit,
        });
    }
    async getRecentProducts(limit = 8) {
        return await this.productRepository.find({
            relations: ['category'],
            order: {
                last_scraped_at: 'DESC'
            },
            take: limit,
        });
    }
    async updateProductRating(productId, rating, reviewCount) {
        const product = await this.findOne(productId);
        product.rating = rating;
        product.review_count = reviewCount;
        return await this.productRepository.save(product);
    }
    async getProductsByPriceRange(minPrice, maxPrice, page = 1, limit = 12) {
        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.price BETWEEN :minPrice AND :maxPrice', {
            minPrice,
            maxPrice
        });
        const skip = (page - 1) * limit;
        const [products, total] = await query
            .skip(skip)
            .take(limit)
            .orderBy('product.price', 'ASC')
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            products,
            total,
            page,
            totalPages,
        };
    }
    async getProductsByAuthor(author, page = 1, limit = 12) {
        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.author ILIKE :author', { author: `%${author}%` });
        const skip = (page - 1) * limit;
        const [products, total] = await query
            .skip(skip)
            .take(limit)
            .orderBy('product.last_scraped_at', 'DESC')
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            products,
            total,
            page,
            totalPages,
        };
    }
    async getUniqueAuthors() {
        const authors = await this.productRepository
            .createQueryBuilder('product')
            .select('DISTINCT product.author', 'author')
            .where('product.author IS NOT NULL')
            .andWhere('product.author != :empty', { empty: '' })
            .orderBy('author', 'ASC')
            .getRawMany();
        return authors.map(item => item.author).filter(author => author && author.trim() !== '');
    }
    async getPriceRanges() {
        const result = await this.productRepository
            .createQueryBuilder('product')
            .select('MIN(product.price)', 'min')
            .addSelect('MAX(product.price)', 'max')
            .getRawOne();
        return {
            min: parseFloat(result.min) || 0,
            max: parseFloat(result.max) || 100
        };
    }
    async getProductsGroupedByCategory() {
        const products = await this.getProductsWithCategories();
        const groupedProducts = {};
        products.forEach(product => {
            const categoryName = product.category?.title || 'Uncategorized';
            if (!groupedProducts[categoryName]) {
                groupedProducts[categoryName] = [];
            }
            groupedProducts[categoryName].push(product);
        });
        return groupedProducts;
    }
    async getProductsWithSorting(sortBy = 'newest', page = 1, limit = 12) {
        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category');
        switch (sortBy) {
            case 'price-low':
                query.orderBy('product.price', 'ASC');
                break;
            case 'price-high':
                query.orderBy('product.price', 'DESC');
                break;
            case 'rating':
                query.orderBy('product.rating', 'DESC');
                break;
            case 'title':
                query.orderBy('product.title', 'ASC');
                break;
            case 'author':
                query.orderBy('product.author', 'ASC');
                break;
            case 'category':
                query.orderBy('category.title', 'ASC');
                break;
            default:
                query.orderBy('product.last_scraped_at', 'DESC');
                break;
        }
        const skip = (page - 1) * limit;
        const [products, total] = await query
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            products,
            total,
            page,
            totalPages,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_detail_entity_1.ProductDetail)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map