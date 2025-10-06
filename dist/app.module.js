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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const supabase_test_service_1 = require("./services/supabase-test.service");
const supabase_test_controller_1 = require("./controllers/supabase-test.controller");
const user_entity_1 = require("./entities/user.entity");
const navigation_entity_1 = require("./entities/navigation.entity");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("./entities/product.entity");
const product_detail_entity_1 = require("./entities/product-detail.entity");
const scrape_job_entity_1 = require("./entities/scrape-job.entity");
const view_history_entity_1 = require("./entities/view-history.entity");
const wishlist_entity_1 = require("./entities/wishlist.entity");
const book_entity_1 = require("./entities/book.entity");
const auth_controller_1 = require("./controllers/auth.controller");
const navigation_controller_1 = require("./controllers/navigation.controller");
const categories_controller_1 = require("./controllers/categories.controller");
const products_controller_1 = require("./controllers/products.controller");
const view_history_controller_1 = require("./controllers/view-history.controller");
const debug_controller_1 = require("./controllers/debug.controller");
const wishlist_controller_1 = require("./controllers/wishlist.controller");
const auth_service_1 = require("./services/auth.service");
const navigation_service_1 = require("./services/navigation.service");
const categories_service_1 = require("./services/categories.service");
const products_service_1 = require("./services/products.service");
const product_detail_service_1 = require("./services/product-detail.service");
const view_history_service_1 = require("./services/view-history.service");
const scraping_service_1 = require("./services/scraping.service");
const wishlist_service_1 = require("./services/wishlist.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let AppModule = class AppModule {
    constructor() {
        console.log('Backend initialized successfully');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-fallback-secret-key-change-in-production',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') || '7d'
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            passport_1.PassportModule,
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 300000,
                max: 100,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'db.oajxxioqbowpmgjccxvn.supabase.co'),
                    port: +configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'Th@h!rmd123'),
                    database: configService.get('DB_NAME', 'postgres'),
                    entities: [
                        navigation_entity_1.Navigation,
                        category_entity_1.Category,
                        product_entity_1.Product,
                        product_detail_entity_1.ProductDetail,
                        scrape_job_entity_1.ScrapeJob,
                        view_history_entity_1.ViewHistory,
                        user_entity_1.User,
                        wishlist_entity_1.Wishlist,
                        book_entity_1.Book,
                    ],
                    synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
                    logging: configService.get('DB_LOGGING', 'true') === 'true',
                    ssl: true,
                    extra: {
                        ssl: {
                            rejectUnauthorized: false
                        }
                    }
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                navigation_entity_1.Navigation,
                category_entity_1.Category,
                product_entity_1.Product,
                product_detail_entity_1.ProductDetail,
                scrape_job_entity_1.ScrapeJob,
                view_history_entity_1.ViewHistory,
                user_entity_1.User,
                wishlist_entity_1.Wishlist,
                book_entity_1.Book,
            ]),
        ],
        controllers: [
            navigation_controller_1.NavigationController,
            categories_controller_1.CategoriesController,
            products_controller_1.ProductsController,
            view_history_controller_1.ViewHistoryController,
            debug_controller_1.DebugController,
            auth_controller_1.AuthController,
            wishlist_controller_1.WishlistController,
            supabase_test_controller_1.SupabaseTestController,
        ],
        providers: [
            navigation_service_1.NavigationService,
            categories_service_1.CategoriesService,
            products_service_1.ProductsService,
            product_detail_service_1.ProductDetailService,
            view_history_service_1.ViewHistoryService,
            scraping_service_1.ScrapingService,
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            wishlist_service_1.WishlistService,
            supabase_test_service_1.SupabaseTestService,
        ],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
//# sourceMappingURL=app.module.js.map