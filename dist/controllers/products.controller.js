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
var ProductsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("../services/products.service");
const scraping_service_1 = require("../services/scraping.service");
const product_entity_1 = require("../entities/product.entity");
let ProductsController = ProductsController_1 = class ProductsController {
    constructor(productsService, scrapingService) {
        this.productsService = productsService;
        this.scrapingService = scrapingService;
        this.logger = new common_1.Logger(ProductsController_1.name);
        this.logger.log('ProductsController initialized');
    }
    async getProducts(search, minPrice, maxPrice, minRating, category, author, page) {
        try {
            let result = await this.productsService.findWithFilters({
                search,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                minRating: minRating ? parseFloat(minRating) : undefined,
                category,
                author,
                page: page ? parseInt(page) : 1,
            });
            if (result.products.length === 0) {
                this.logger.log('No products found, triggering automatic scrape...');
                const scrapedProducts = await this.scrapingService.scrapeBooks();
                result = { products: scrapedProducts, total: scrapedProducts.length, page: 1, totalPages: 1 };
            }
            return { data: result.products };
        }
        catch (error) {
            this.logger.error(`getProducts failed: ${error.message}`, error.stack);
            throw new common_1.HttpException(`Failed to fetch products: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProductStats() {
        try {
            const stats = await this.productsService.getProductStats();
            return { data: stats };
        }
        catch (error) {
            this.logger.error(`getProductStats failed: ${error.message}`, error.stack);
            throw new common_1.HttpException(`Failed to fetch product statistics: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProduct(id) {
        try {
            const product = await this.productsService.findOne(id);
            return { data: product };
        }
        catch (error) {
            this.logger.error(`getProduct(${id}) failed: ${error.message}`, error.stack);
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to fetch product: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshProducts() {
        try {
            this.logger.log('Manual refresh triggered via /products/refresh');
            const products = await this.scrapingService.scrapeBooks();
            return {
                data: products,
                message: `Successfully scraped ${products.length} products from World of Books`
            };
        }
        catch (error) {
            this.logger.error(`refreshProducts failed: ${error.message}`, error.stack);
            if (error.message === 'Scraping already in progress') {
                throw new common_1.HttpException('Scraping already in progress. Please wait for current scraping to complete.', common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            throw new common_1.HttpException(`Failed to refresh products: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get products with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, description: 'Minimum price' }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, description: 'Maximum price' }),
    (0, swagger_1.ApiQuery)({ name: 'minRating', required: false, description: 'Minimum rating' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Category slug' }),
    (0, swagger_1.ApiQuery)({ name: 'author', required: false, description: 'Author name' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns filtered products' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('minPrice')),
    __param(2, (0, common_1.Query)('maxPrice')),
    __param(3, (0, common_1.Query)('minRating')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('author')),
    __param(6, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns product statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns product', type: product_entity_1.Product }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh products by scraping World of Books' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Products refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Scraping already in progress' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "refreshProducts", null);
exports.ProductsController = ProductsController = ProductsController_1 = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        scraping_service_1.ScrapingService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map