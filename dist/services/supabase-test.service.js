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
exports.SupabaseTestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const user_entity_1 = require("../entities/user.entity");
let SupabaseTestService = class SupabaseTestService {
    constructor(productRepository, categoryRepository, userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }
    async testConnection() {
        try {
            console.log('🧪 Testing PostgreSQL database connection with entities...');
            const productCount = await this.productRepository.count();
            const categoryCount = await this.categoryRepository.count();
            const userCount = await this.userRepository.count();
            return {
                success: true,
                message: '✅ Connected to Supabase PostgreSQL successfully! All entities are working.',
                counts: {
                    products: productCount,
                    categories: categoryCount,
                    users: userCount
                },
                database: 'Supabase PostgreSQL',
                nextStep: 'Your backend is now fully connected to Supabase!'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                suggestion: 'Check if your entities match the database schema'
            };
        }
    }
};
exports.SupabaseTestService = SupabaseTestService;
exports.SupabaseTestService = SupabaseTestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SupabaseTestService);
//# sourceMappingURL=supabase-test.service.js.map