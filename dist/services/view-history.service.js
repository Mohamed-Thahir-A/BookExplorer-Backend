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
exports.ViewHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const view_history_entity_1 = require("../entities/view-history.entity");
let ViewHistoryService = class ViewHistoryService {
    constructor(viewHistoryRepository) {
        this.viewHistoryRepository = viewHistoryRepository;
    }
    async trackView(sessionId, userId, path, params = {}) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let viewHistory = await this.viewHistoryRepository.findOne({
            where: {
                session_id: sessionId,
                created_at: (0, typeorm_2.MoreThan)(today)
            },
            order: { created_at: 'DESC' },
        });
        const pathEntry = {
            path: path || '/',
            params,
            timestamp: new Date().toISOString(),
        };
        if (viewHistory) {
            viewHistory.path_json = [...viewHistory.path_json, pathEntry].slice(-50);
            viewHistory.user_id = userId || viewHistory.user_id;
            return this.viewHistoryRepository.save(viewHistory);
        }
        else {
            const newHistory = this.viewHistoryRepository.create({
                session_id: sessionId,
                user_id: userId,
                path_json: [pathEntry],
            });
            return this.viewHistoryRepository.save(newHistory);
        }
    }
    async getUserHistory(userId, limit = 50) {
        return this.viewHistoryRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            take: limit,
        });
    }
    async getSessionHistory(sessionId) {
        return this.viewHistoryRepository.findOne({
            where: { session_id: sessionId },
            order: { created_at: 'DESC' },
        });
    }
    async getRecentActivity(userId, limit = 20) {
        const history = await this.viewHistoryRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            take: limit,
        });
        const recentActivity = history.flatMap(record => record.path_json.map(entry => ({
            ...entry,
            session_id: record.session_id,
            created_at: record.created_at,
        }))).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
        return recentActivity;
    }
    async getPopularProducts(days = 7, limit = 10) {
        console.log(`Getting popular products for last ${days} days, limit: ${limit}`);
        return [];
    }
    async cleanupOldHistory(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const result = await this.viewHistoryRepository
            .createQueryBuilder()
            .delete()
            .where('created_at < :cutoffDate', { cutoffDate })
            .execute();
        return { deletedCount: result.affected };
    }
    async getStatistics() {
        const totalSessions = await this.viewHistoryRepository.count();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sessionsToday = await this.viewHistoryRepository.count({
            where: { created_at: (0, typeorm_2.MoreThan)(today) }
        });
        const uniqueUsers = await this.viewHistoryRepository
            .createQueryBuilder('view_history')
            .select('COUNT(DISTINCT user_id)', 'count')
            .where('user_id IS NOT NULL')
            .getRawOne();
        return {
            totalSessions,
            sessionsToday,
            uniqueUsers: parseInt(uniqueUsers.count) || 0,
        };
    }
};
exports.ViewHistoryService = ViewHistoryService;
exports.ViewHistoryService = ViewHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(view_history_entity_1.ViewHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ViewHistoryService);
//# sourceMappingURL=view-history.service.js.map