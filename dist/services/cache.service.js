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
exports.CacheService = exports.CacheEntry = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
let CacheEntry = class CacheEntry {
};
exports.CacheEntry = CacheEntry;
__decorate([
    (0, typeorm_3.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CacheEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_3.Column)({ unique: true }),
    __metadata("design:type", String)
], CacheEntry.prototype, "key", void 0);
__decorate([
    (0, typeorm_3.Column)('text'),
    __metadata("design:type", String)
], CacheEntry.prototype, "value", void 0);
__decorate([
    (0, typeorm_3.Column)(),
    __metadata("design:type", Date)
], CacheEntry.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_3.CreateDateColumn)(),
    __metadata("design:type", Date)
], CacheEntry.prototype, "createdAt", void 0);
exports.CacheEntry = CacheEntry = __decorate([
    (0, typeorm_3.Entity)('cache_entries')
], CacheEntry);
let CacheService = class CacheService {
    constructor(cacheRepository) {
        this.cacheRepository = cacheRepository;
    }
    async get(key) {
        const entry = await this.cacheRepository.findOne({
            where: { key, expiresAt: (0, typeorm_2.MoreThan)(new Date()) },
        });
        if (!entry)
            return null;
        return JSON.parse(entry.value);
    }
    async set(key, value, ttlSeconds = 3600) {
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
        await this.cacheRepository.upsert({
            key,
            value: JSON.stringify(value),
            expiresAt,
        }, ['key']);
    }
    async invalidate(key) {
        await this.cacheRepository.delete({ key });
    }
    async clearExpired() {
        await this.cacheRepository
            .createQueryBuilder()
            .delete()
            .where('expiresAt < :now', { now: new Date() })
            .execute();
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(CacheEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CacheService);
//# sourceMappingURL=cache.service.js.map