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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
const product_entity_1 = require("../entities/product.entity");
let CategoriesService = CategoriesService_1 = class CategoriesService {
    constructor(categoriesRepository, productsRepository) {
        this.categoriesRepository = categoriesRepository;
        this.productsRepository = productsRepository;
        this.logger = new common_1.Logger(CategoriesService_1.name);
        this.logger.log('CategoriesService initialized');
    }
    async findAll() {
        try {
            const categories = await this.categoriesRepository.find({
                relations: ['navigation', 'parent', 'children'],
                order: { title: 'ASC' },
            });
            this.logger.log(`Found ${categories.length} categories in database`);
            return categories;
        }
        catch (error) {
            this.logger.error(`Error finding categories: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['navigation', 'parent', 'children', 'products'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.categoriesRepository.findOne({
            where: { slug },
            relations: ['navigation', 'parent', 'children'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug ${slug} not found`);
        }
        return category;
    }
    async getCategoryProducts(slug) {
        try {
            const category = await this.categoriesRepository.findOne({
                where: { slug },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with slug ${slug} not found`);
            }
            const products = await this.productsRepository.find({
                where: { category_id: category.id },
                relations: ['category'],
                order: { last_scraped_at: 'DESC' },
            });
            this.logger.log(`Found ${products.length} products for category ${slug}`);
            return products;
        }
        catch (error) {
            this.logger.error(`Error getting products for category ${slug}: ${error.message}`);
            throw error;
        }
    }
    async getProductsByCategoryId(categoryId) {
        try {
            const products = await this.productsRepository.find({
                where: { category_id: categoryId },
                relations: ['category'],
                order: { last_scraped_at: 'DESC' },
            });
            this.logger.log(`Found ${products.length} products for category ID ${categoryId}`);
            return products;
        }
        catch (error) {
            this.logger.error(`Error getting products for category ID ${categoryId}: ${error.message}`);
            throw error;
        }
    }
    async updateFromScrape(id, scrapedData) {
        const category = await this.findOne(id);
        if (scrapedData.products) {
            category.product_count = scrapedData.products.length;
        }
        Object.assign(category, scrapedData);
        return await this.categoriesRepository.save(category);
    }
    async clearAll() {
        const result = await this.categoriesRepository.delete({});
        this.logger.log(`Cleared ${result.affected} categories`);
        return {
            message: 'All categories cleared successfully',
            deletedCount: result.affected || 0
        };
    }
    async getCategoryStats() {
        const totalCategories = await this.categoriesRepository.count();
        const stats = await this.categoriesRepository
            .createQueryBuilder('category')
            .select('SUM(category.product_count)', 'totalProducts')
            .addSelect('COUNT(CASE WHEN category.product_count > 0 THEN 1 END)', 'categoriesWithProducts')
            .getRawOne();
        return {
            totalCategories,
            totalProducts: parseInt(stats.totalProducts) || 0,
            categoriesWithProducts: parseInt(stats.categoriesWithProducts) || 0,
        };
    }
    async updateAllCategoryCounts() {
        const categories = await this.categoriesRepository.find();
        for (const category of categories) {
            const count = await this.productsRepository
                .createQueryBuilder('product')
                .innerJoin('product.category', 'category')
                .where('category.id = :categoryId', { categoryId: category.id })
                .getCount();
            category.product_count = count;
            await this.categoriesRepository.save(category);
            console.log(`Updated ${category.title}: ${count} products`);
        }
        return { message: 'Category counts updated successfully' };
    }
    async updateCategoryAfterScraping(categoryId, newProductsCount) {
        const category = await this.findOne(categoryId);
        const currentCount = await this.productsRepository.count({
            where: { category_id: categoryId }
        });
        category.product_count = currentCount;
        await this.categoriesRepository.save(category);
        this.logger.log(`Updated category ${category.title} product count to ${currentCount}`);
        return category;
    }
    async createFromScrape(scrapedCategories) {
        this.logger.log(`Creating ${scrapedCategories.length} categories from scraped data`);
        const createdCategories = [];
        for (const categoryData of scrapedCategories) {
            try {
                let category = await this.categoriesRepository.findOne({
                    where: { slug: categoryData.slug }
                });
                if (!category) {
                    category = this.categoriesRepository.create({
                        title: categoryData.title,
                        slug: categoryData.slug,
                        product_count: 0,
                    });
                    category = await this.categoriesRepository.save(category);
                    createdCategories.push(category);
                    this.logger.log(`Created category from scrape: ${categoryData.title}`);
                }
                else {
                    await this.categoriesRepository.update(category.id, {
                        title: categoryData.title,
                        last_scraped_at: new Date(),
                    });
                    createdCategories.push(category);
                    this.logger.log(`Updated category from scrape: ${categoryData.title}`);
                }
            }
            catch (error) {
                this.logger.error(`Error creating category "${categoryData.title}": ${error.message}`);
            }
        }
        return createdCategories;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map