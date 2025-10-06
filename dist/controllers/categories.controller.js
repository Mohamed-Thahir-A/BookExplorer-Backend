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
var CategoriesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categories_service_1 = require("../services/categories.service");
const scraping_service_1 = require("../services/scraping.service");
const category_entity_1 = require("../entities/category.entity");
const products_service_1 = require("../services/products.service");
let CategoriesController = CategoriesController_1 = class CategoriesController {
    constructor(categoriesService, scrapingService, productsService) {
        this.categoriesService = categoriesService;
        this.scrapingService = scrapingService;
        this.productsService = productsService;
        this.logger = new common_1.Logger(CategoriesController_1.name);
    }
    async getCategories() {
        try {
            let categories = await this.categoriesService.findAll();
            if (categories.length === 0) {
                await this.scrapingService.scrapeNavigation();
                categories = await this.categoriesService.findAll();
            }
            return { data: categories };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch categories', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCategoryStats() {
        try {
            const stats = await this.categoriesService.getCategoryStats();
            return { data: stats };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch category statistics', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCategory(id) {
        try {
            const category = await this.categoriesService.findOne(id);
            return { data: category };
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException('Failed to fetch category', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCategoryCounts() {
        return this.categoriesService.updateAllCategoryCounts();
    }
    async getCategoryBySlug(slug) {
        try {
            const category = await this.categoriesService.findBySlug(slug);
            return { data: category };
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException('Failed to fetch category', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCategoryProductsBySlug(slug) {
        try {
            const category = await this.categoriesService.findBySlug(slug);
            const products = await this.categoriesService.getCategoryProducts(slug);
            return {
                data: {
                    category,
                    products
                }
            };
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException('Failed to fetch category products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCategoryProductsById(id) {
        try {
            const category = await this.categoriesService.findOne(id);
            const products = await this.categoriesService.getProductsByCategoryId(id);
            return {
                data: {
                    category,
                    products
                }
            };
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException('Failed to fetch category products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loadMoreCategoryBooks(slug, page = '1', currentCount = 0) {
        try {
            const category = await this.categoriesService.findBySlug(slug);
            const requestedPage = parseInt(page) || 1;
            this.logger.log(`🔄 User requested more books for ${slug}, scraping page ${requestedPage} with ${currentCount} existing books`);
            const productsResult = await this.productsService.findByCategorySlug(slug);
            const existingProducts = productsResult.products;
            this.logger.log(`📊 Found ${existingProducts.length} existing products in database for deduplication`);
            const existingTitles = new Set(existingProducts.map(product => `${product.title}-${product.author}`.toLowerCase().trim()));
            const scrapedProducts = await this.scrapingService.scrapeCategoryWithPagination(slug, requestedPage);
            const newProducts = scrapedProducts.filter(product => {
                const productKey = `${product.title}-${product.author}`.toLowerCase().trim();
                return !existingTitles.has(productKey);
            });
            const savedProducts = [];
            for (const productData of newProducts) {
                try {
                    const savedProduct = await this.productsService.create({
                        ...productData,
                        category: category
                    });
                    savedProducts.push(savedProduct);
                }
                catch (error) {
                    this.logger.error(`❌ Failed to save product: ${productData.title}`, error.message);
                }
            }
            const hasMore = scrapedProducts.length > 0;
            const nextPage = hasMore ? requestedPage + 1 : null;
            this.logger.log(`✅ Live scraping completed: ${savedProducts.length} new books (filtered ${scrapedProducts.length - savedProducts.length} duplicates) for ${category.title}`);
            return {
                data: {
                    category,
                    products: savedProducts,
                    currentPage: requestedPage,
                    hasMore,
                    nextPage,
                    message: `Live scraping: Added ${savedProducts.length} fresh books from page ${requestedPage} (filtered ${scrapedProducts.length - savedProducts.length} duplicates)`,
                    stats: {
                        totalScraped: scrapedProducts.length,
                        newProducts: savedProducts.length,
                        duplicates: scrapedProducts.length - savedProducts.length
                    }
                }
            };
        }
        catch (error) {
            this.logger.error(`❌ Live scraping failed for ${slug}: ${error.message}`);
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException(`Live scraping failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshCategoryBooks(id) {
        try {
            const category = await this.categoriesService.findOne(id);
            const scrapedProducts = await this.scrapingService.scrapeCategoryBooks(category.slug);
            return {
                data: {
                    category,
                    products: scrapedProducts,
                    message: `Successfully refreshed ${scrapedProducts.length} books for ${category.title}`
                }
            };
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException('Failed to refresh category books', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshCategoryBooksBySlug(slug) {
        try {
            const category = await this.categoriesService.findBySlug(slug);
            const scrapedProducts = await this.scrapingService.scrapeCategoryBooks(slug);
            return {
                data: {
                    category,
                    products: scrapedProducts,
                    message: `Successfully refreshed ${scrapedProducts.length} books for ${category.title}`
                }
            };
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException('Failed to refresh category books', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all categories', type: [category_entity_1.Category] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns category statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategoryStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Category UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns category', type: category_entity_1.Category }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Post)('update-counts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "updateCategoryCounts", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Category slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns category', type: category_entity_1.Category }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategoryBySlug", null);
__decorate([
    (0, common_1.Get)('slug/:slug/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products by category slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Category slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns category products' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategoryProductsBySlug", null);
__decorate([
    (0, common_1.Get)(':id/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products by category ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Category UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns category products' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategoryProductsById", null);
__decorate([
    (0, common_1.Post)('load-more/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('currentCount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "loadMoreCategoryBooks", null);
__decorate([
    (0, common_1.Post)(':id/refresh-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh books for a specific category' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Category UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category books refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "refreshCategoryBooks", null);
__decorate([
    (0, common_1.Post)('slug/:slug/refresh-books'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh books for a category by slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Category slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category books refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "refreshCategoryBooksBySlug", null);
exports.CategoriesController = CategoriesController = CategoriesController_1 = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService,
        scraping_service_1.ScrapingService,
        products_service_1.ProductsService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map