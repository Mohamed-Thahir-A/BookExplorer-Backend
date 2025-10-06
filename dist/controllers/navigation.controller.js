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
var NavigationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const navigation_entity_1 = require("../entities/navigation.entity");
const scraping_service_1 = require("../services/scraping.service");
const navigation_service_1 = require("../services/navigation.service");
let NavigationController = NavigationController_1 = class NavigationController {
    constructor(scrapingService, navigationService) {
        this.scrapingService = scrapingService;
        this.navigationService = navigationService;
        this.logger = new common_1.Logger(NavigationController_1.name);
        console.log('✅ NavigationController initialized!');
        console.log('   - ScrapingService:', !!this.scrapingService);
        console.log('   - NavigationService:', !!this.navigationService);
    }
    async getNavigation(includeCategories) {
        console.log('🔍 GET /api/navigation called');
        try {
            this.logger.log('Fetching navigation items');
            const navigation = await this.navigationService.findAll(includeCategories);
            console.log(`📊 Found ${navigation.length} navigation items`);
            if (navigation.length === 0) {
                console.log('🔄 No navigation found, triggering initial scrape');
                this.logger.log('No navigation found, triggering initial scrape');
                const scrapedNav = await this.scrapingService.scrapeNavigation();
                return { data: scrapedNav };
            }
            return { data: navigation };
        }
        catch (error) {
            console.error('❌ Error in getNavigation:', error);
            this.logger.error(`Failed to fetch navigation: ${error.message}`);
            throw new common_1.HttpException('Failed to fetch navigation items', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNavigationById(id) {
        console.log(`🔍 GET /api/navigation/${id} called`);
        try {
            this.logger.log(`Fetching navigation item with ID: ${id}`);
            const navigation = await this.navigationService.findById(id);
            if (!navigation) {
                throw new common_1.HttpException('Navigation item not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { data: navigation };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Failed to fetch navigation item ${id}: ${error.message}`);
            throw new common_1.HttpException('Failed to fetch navigation item', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshNavigation() {
        console.log('🔄 POST /api/navigation/refresh called');
        try {
            this.logger.log('Starting navigation data refresh');
            const recentJob = await this.navigationService.findRecentScrapeJob();
            if (recentJob && this.isJobTooRecent(recentJob.started_at)) {
                throw new common_1.HttpException('Scrape job already running recently. Please wait before starting another.', common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            const scrapedNavigation = await this.scrapingService.scrapeNavigation();
            this.logger.log(`Successfully refreshed ${scrapedNavigation.length} navigation items`);
            console.log(`✅ Navigation refresh completed with ${scrapedNavigation.length} items`);
            return { data: scrapedNavigation };
        }
        catch (error) {
            console.error('❌ Error in refreshNavigation:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Navigation refresh failed: ${error.message}`);
            throw new common_1.HttpException('Failed to refresh navigation data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateNavigation(id, updateData) {
        console.log(`✏️ PUT /api/navigation/${id} called`);
        try {
            this.logger.log(`Updating navigation item ${id}`);
            const updated = await this.navigationService.update(id, updateData);
            if (!updated) {
                throw new common_1.HttpException('Navigation item not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { data: updated };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Failed to update navigation item ${id}: ${error.message}`);
            throw new common_1.HttpException('Failed to update navigation item', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteNavigation(id) {
        console.log(`🗑️ DELETE /api/navigation/${id} called`);
        try {
            this.logger.log(`Deleting navigation item ${id}`);
            const deleted = await this.navigationService.delete(id);
            if (!deleted) {
                throw new common_1.HttpException('Navigation item not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { data: { message: 'Navigation item deleted successfully' } };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Failed to delete navigation item ${id}: ${error.message}`);
            throw new common_1.HttpException('Failed to delete navigation item', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNavigationBySlug(slug) {
        console.log(`🔍 GET /api/navigation/slug/${slug} called`);
        try {
            this.logger.log(`Fetching navigation item with slug: ${slug}`);
            const navigation = await this.navigationService.findBySlug(slug);
            if (!navigation) {
                throw new common_1.HttpException('Navigation item not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { data: navigation };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Failed to fetch navigation item by slug ${slug}: ${error.message}`);
            throw new common_1.HttpException('Failed to fetch navigation item', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getScrapeStatus() {
        console.log('📊 POST /api/navigation/scrape-status called');
        try {
            const recentJob = await this.navigationService.findRecentScrapeJob();
            const totalItems = await this.navigationService.getTotalCount();
            return {
                data: {
                    isScraping: recentJob ? this.isJobRunning(recentJob.started_at) : false,
                    lastScrape: recentJob?.started_at || null,
                    totalItems,
                }
            };
        }
        catch (error) {
            this.logger.error(`Failed to get scrape status: ${error.message}`);
            throw new common_1.HttpException('Failed to get scrape status', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    isJobTooRecent(startedAt) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return startedAt > fiveMinutesAgo;
    }
    isJobRunning(startedAt) {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        return startedAt > thirtyMinutesAgo;
    }
};
exports.NavigationController = NavigationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all navigation items' }),
    (0, swagger_1.ApiQuery)({ name: 'includeCategories', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all navigation items', type: [navigation_entity_1.Navigation] }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('includeCategories')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getNavigation", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get navigation item by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Navigation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns navigation item', type: navigation_entity_1.Navigation }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Navigation item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getNavigationById", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh navigation data by scraping World of Books' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Navigation data refreshed successfully', type: [navigation_entity_1.Navigation] }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Too many scrape requests' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Scraping failed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "refreshNavigation", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update navigation item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Navigation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Navigation item updated', type: navigation_entity_1.Navigation }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Navigation item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "updateNavigation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete navigation item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Navigation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Navigation item deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Navigation item not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "deleteNavigation", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get navigation item by slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Navigation slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns navigation item', type: navigation_entity_1.Navigation }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Navigation item not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getNavigationBySlug", null);
__decorate([
    (0, common_1.Post)('scrape-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current scraping status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns scrape status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getScrapeStatus", null);
exports.NavigationController = NavigationController = NavigationController_1 = __decorate([
    (0, swagger_1.ApiTags)('navigation'),
    (0, common_1.Controller)('navigation'),
    __metadata("design:paramtypes", [scraping_service_1.ScrapingService,
        navigation_service_1.NavigationService])
], NavigationController);
//# sourceMappingURL=navigation.controller.js.map