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
var NavigationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const navigation_entity_1 = require("../entities/navigation.entity");
const scrape_job_entity_1 = require("../entities/scrape-job.entity");
let NavigationService = NavigationService_1 = class NavigationService {
    constructor(navigationRepository, scrapeJobRepository) {
        this.navigationRepository = navigationRepository;
        this.scrapeJobRepository = scrapeJobRepository;
        this.logger = new common_1.Logger(NavigationService_1.name);
        console.log('✅ NavigationService initialized!');
        console.log('   - NavigationRepository:', !!this.navigationRepository);
        console.log('   - ScrapeJobRepository:', !!this.scrapeJobRepository);
    }
    async findAll(includeCategories = false) {
        console.log(`🔍 NavigationService.findAll called (includeCategories: ${includeCategories})`);
        const relations = {};
        if (includeCategories) {
            relations.categories = true;
        }
        const result = await this.navigationRepository.find({
            relations,
            order: { title: 'ASC' },
        });
        console.log(`📊 NavigationService found ${result.length} items`);
        return result;
    }
    async findById(id) {
        console.log(`🔍 NavigationService.findById called for: ${id}`);
        const result = await this.navigationRepository.findOne({
            where: { id },
            relations: { categories: true },
        });
        console.log(`📊 NavigationService findById result: ${result ? 'FOUND' : 'NOT FOUND'}`);
        return result;
    }
    async findBySlug(slug) {
        console.log(`🔍 NavigationService.findBySlug called for: ${slug}`);
        const result = await this.navigationRepository.findOne({
            where: { slug },
            relations: { categories: true },
        });
        console.log(`📊 NavigationService findBySlug result: ${result ? 'FOUND' : 'NOT FOUND'}`);
        return result;
    }
    async update(id, updateData) {
        console.log(`✏️ NavigationService.update called for: ${id}`);
        await this.navigationRepository.update(id, {
            ...updateData,
            last_scraped_at: new Date(),
        });
        const result = await this.findById(id);
        console.log(`📊 NavigationService update result: ${result ? 'SUCCESS' : 'FAILED'}`);
        return result;
    }
    async delete(id) {
        console.log(`🗑️ NavigationService.delete called for: ${id}`);
        const result = await this.navigationRepository.delete(id);
        const success = result.affected > 0;
        console.log(`📊 NavigationService delete result: ${success ? 'SUCCESS' : 'FAILED'}`);
        return success;
    }
    async findRecentScrapeJob() {
        console.log('🔍 NavigationService.findRecentScrapeJob called');
        const result = await this.scrapeJobRepository.findOne({
            where: { target_type: scrape_job_entity_1.ScrapeTargetType.NAVIGATION },
            order: { started_at: 'DESC' },
        });
        console.log(`📊 NavigationService findRecentScrapeJob result: ${result ? 'FOUND' : 'NOT FOUND'}`);
        return result;
    }
    async getTotalCount() {
        console.log('🔍 NavigationService.getTotalCount called');
        const count = await this.navigationRepository.count();
        console.log(`📊 NavigationService total count: ${count}`);
        return count;
    }
    async create(navigationData) {
        console.log('📝 NavigationService.create called');
        const navigation = this.navigationRepository.create({
            ...navigationData,
            last_scraped_at: new Date(),
        });
        const result = await this.navigationRepository.save(navigation);
        console.log(`📊 NavigationService create result: SUCCESS (ID: ${result.id})`);
        return result;
    }
    async updateFromScrape(scrapedData) {
        console.log(`🔄 NavigationService.updateFromScrape called with ${scrapedData.length} items`);
        const navigations = [];
        for (const item of scrapedData) {
            let navigation = await this.navigationRepository.findOne({
                where: { slug: item.slug }
            });
            if (navigation) {
                await this.navigationRepository.update(navigation.id, {
                    title: item.title,
                    last_scraped_at: new Date(),
                });
                navigation = await this.findById(navigation.id);
                console.log(`🔄 Updated navigation: ${item.title}`);
            }
            else {
                navigation = await this.create({
                    title: item.title,
                    slug: item.slug,
                });
                console.log(`💾 Created navigation: ${item.title}`);
            }
            if (navigation) {
                navigations.push(navigation);
            }
        }
        console.log(`✅ NavigationService.updateFromScrape completed: ${navigations.length} items processed`);
        return navigations;
    }
};
exports.NavigationService = NavigationService;
exports.NavigationService = NavigationService = NavigationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(navigation_entity_1.Navigation)),
    __param(1, (0, typeorm_1.InjectRepository)(scrape_job_entity_1.ScrapeJob)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NavigationService);
//# sourceMappingURL=navigation.service.js.map