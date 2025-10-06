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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const scraping_service_1 = require("../../services/scraping.service");
let ProductsController = class ProductsController {
    constructor(productsService, scrapingService) {
        this.productsService = productsService;
        this.scrapingService = scrapingService;
    }
    async getProducts(search, minPrice, maxPrice, minRating, category, author, page = 1, limit = 12) {
        return this.productsService.findWithFilters({
            search,
            minPrice,
            maxPrice,
            minRating,
            category,
            author,
            page,
            limit,
        });
    }
    async getProduct(id) {
        return this.productsService.findOne(parseInt(id));
    }
    async refreshProducts() {
        return this.scrapingService.scrapeBooks();
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('minPrice')),
    __param(2, (0, common_1.Query)('maxPrice')),
    __param(3, (0, common_1.Query)('minRating')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('author')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "refreshProducts", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('api/products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        scraping_service_1.ScrapingService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map