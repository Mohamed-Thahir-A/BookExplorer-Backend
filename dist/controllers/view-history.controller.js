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
exports.ViewHistoryController = void 0;
const common_1 = require("@nestjs/common");
const view_history_service_1 = require("../services/view-history.service");
let ViewHistoryController = class ViewHistoryController {
    constructor(viewHistoryService) {
        this.viewHistoryService = viewHistoryService;
    }
    async trackView(trackData) {
        return this.viewHistoryService.trackView(trackData.sessionId, trackData.userId, trackData.path, trackData.params);
    }
    async getUserHistory(userId, limit) {
        return this.viewHistoryService.getUserHistory(userId, limit);
    }
    async getSessionHistory(sessionId) {
        return this.viewHistoryService.getSessionHistory(sessionId);
    }
    async getRecentActivity(userId, limit) {
        return this.viewHistoryService.getRecentActivity(userId, limit);
    }
    async getPopularProducts(days, limit) {
        return this.viewHistoryService.getPopularProducts(days, limit);
    }
    async getStatistics() {
        return this.viewHistoryService.getStatistics();
    }
    async cleanupOldHistory(days) {
        return this.viewHistoryService.cleanupOldHistory(days);
    }
};
exports.ViewHistoryController = ViewHistoryController;
__decorate([
    (0, common_1.Post)('track'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViewHistoryController.prototype, "trackView", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ViewHistoryController.prototype, "getUserHistory", null);
__decorate([
    (0, common_1.Get)('session/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViewHistoryController.prototype, "getSessionHistory", null);
__decorate([
    (0, common_1.Get)('recent-activity/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ViewHistoryController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.Get)('popular-products'),
    __param(0, (0, common_1.Query)('days', new common_1.DefaultValuePipe(7), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ViewHistoryController.prototype, "getPopularProducts", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ViewHistoryController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    __param(0, (0, common_1.Query)('days', new common_1.DefaultValuePipe(30), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ViewHistoryController.prototype, "cleanupOldHistory", null);
exports.ViewHistoryController = ViewHistoryController = __decorate([
    (0, common_1.Controller)('view-history'),
    __metadata("design:paramtypes", [view_history_service_1.ViewHistoryService])
], ViewHistoryController);
//# sourceMappingURL=view-history.controller.js.map