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
exports.NavigationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const navigation_entity_1 = require("../../entities/navigation.entity");
let NavigationService = class NavigationService {
    constructor(navigationRepository) {
        this.navigationRepository = navigationRepository;
    }
    async findAll() {
        try {
            console.log('Finding all navigation items...');
            const navigations = await this.navigationRepository.find({
                relations: ['categories'],
            });
            if (navigations.length === 0) {
                console.log('Database empty, returning mock data');
                return this.getMockNavigation();
            }
            console.log(`Found ${navigations.length} navigation items`);
            return navigations;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            return this.getMockNavigation();
        }
    }
    async findOne(id) {
        try {
            const navigation = await this.navigationRepository.findOne({
                where: { id },
                relations: ['categories'],
            });
            if (!navigation) {
                const mockNavigation = this.getMockNavigation().find(item => item.id === id);
                if (mockNavigation) {
                    return mockNavigation;
                }
                throw new common_1.NotFoundException(`Navigation with ID ${id} not found`);
            }
            return navigation;
        }
        catch (error) {
            console.error('Error finding navigation:', error);
            throw error;
        }
    }
    async updateFromScrape(scrapedData) {
        try {
            console.log('Updating navigation from scrape data...');
            return await this.findAll();
        }
        catch (error) {
            console.error('Error updating from scrape:', error);
            return this.getMockNavigation();
        }
    }
    getMockNavigation() {
        const mockNavigation = [
            {
                id: '1',
                title: 'Books',
                slug: 'books',
                last_scraped_at: new Date(),
                categories: []
            },
            {
                id: '2',
                title: 'Children\'s Books',
                slug: 'childrens-books',
                last_scraped_at: new Date(),
                categories: []
            },
            {
                id: '3',
                title: 'Fiction',
                slug: 'fiction',
                last_scraped_at: new Date(),
                categories: []
            },
            {
                id: '4',
                title: 'Non-Fiction',
                slug: 'non-fiction',
                last_scraped_at: new Date(),
                categories: []
            },
        ];
        return mockNavigation;
    }
    async seedInitialData() {
        try {
            const existing = await this.navigationRepository.find();
            if (existing.length === 0) {
                const mockData = this.getMockNavigation();
                const saved = await this.navigationRepository.save(mockData);
                console.log(`Seeded ${saved.length} navigation items`);
                return saved;
            }
            return existing;
        }
        catch (error) {
            console.error('Error seeding data:', error);
            return this.getMockNavigation();
        }
    }
};
exports.NavigationService = NavigationService;
exports.NavigationService = NavigationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(navigation_entity_1.Navigation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NavigationService);
//# sourceMappingURL=navigation.service.js.map