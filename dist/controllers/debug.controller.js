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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugController = void 0;
const common_1 = require("@nestjs/common");
const scraping_service_1 = require("../services/scraping.service");
let DebugController = class DebugController {
    constructor(scrapingService) {
        this.scrapingService = scrapingService;
    }
    async test() {
        return { message: 'Debug endpoint working', timestamp: new Date() };
    }
    async debugNavigation() {
        try {
            return await this.scrapingService.scrapeNavigation(true);
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async debugBooks() {
        try {
            return await this.scrapingService.scrapeBooks(true);
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async scrapeNavigation() {
        try {
            return await this.scrapingService.scrapeNavigation(true);
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async scrapeBooks() {
        try {
            return await this.scrapingService.scrapeBooks(true);
        }
        catch (error) {
            return { error: error.message };
        }
    }
};
exports.DebugController = DebugController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('navigation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "debugNavigation", null);
__decorate([
    (0, common_1.Get)('books'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "debugBooks", null);
__decorate([
    (0, common_1.Post)('scrape-navigation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "scrapeNavigation", null);
__decorate([
    (0, common_1.Post)('scrape-books'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "scrapeBooks", null);
exports.DebugController = DebugController = __decorate([
    (0, common_1.Controller)('debug'),
    __metadata("design:paramtypes", [scraping_service_1.ScrapingService])
], DebugController);
//# sourceMappingURL=debug.controller.js.map