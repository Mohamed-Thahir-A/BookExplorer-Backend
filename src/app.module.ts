import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SupabaseTestService } from './services/supabase-test.service'
import { SupabaseTestController } from './controllers/supabase-test.controller'

import { User } from './entities/user.entity';
import { Navigation } from './entities/navigation.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductDetail } from './entities/product-detail.entity';
import { ScrapeJob } from './entities/scrape-job.entity';
import { ViewHistory } from './entities/view-history.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Book } from './entities/book.entity';

import { AuthController } from './controllers/auth.controller';
import { NavigationController } from './controllers/navigation.controller';
import { CategoriesController } from './controllers/categories.controller';
import { ProductsController } from './controllers/products.controller';
import { ViewHistoryController } from './controllers/view-history.controller';
import { DebugController } from './controllers/debug.controller';
import { WishlistController } from './controllers/wishlist.controller';

import { AuthService } from './services/auth.service';
import { NavigationService } from './services/navigation.service';
import { CategoriesService } from './services/categories.service';
import { ProductsService } from './services/products.service';
import { ProductDetailService } from './services/product-detail.service';
import { ViewHistoryService } from './services/view-history.service';
import { ScrapingService } from './services/scraping.service';
import { WishlistService } from './services/wishlist.service';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-fallback-secret-key-change-in-production',
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d' 
        },
      }),
      inject: [ConfigService],
    }),
    
    PassportModule,
    
    CacheModule.register({
      isGlobal: true,
      ttl: 300000,
      max: 100, 
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'db.oajxxioqbowpmgjccxvn.supabase.co'),
        port: +configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'Th@h!rmd123'),
        database: configService.get('DB_NAME', 'postgres'),
        entities: [
          Navigation,
          Category,
          Product,
          ProductDetail,
          ScrapeJob,
          ViewHistory,
          User,
          Wishlist,
          Book,
        ],
        synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
        logging: configService.get('DB_LOGGING', 'true') === 'true',
        ssl: true, // Supabase requires SSL
        extra: {
          ssl: {
            rejectUnauthorized: false // Required for Supabase
          }
        }
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([
      Navigation,
      Category,
      Product,
      ProductDetail,
      ScrapeJob,
      ViewHistory,
      User,
      Wishlist,
      Book,
    ]),
  ],
  controllers: [
    NavigationController,
    CategoriesController,
    ProductsController,
    ViewHistoryController,
    DebugController,
    AuthController,
    WishlistController,
    SupabaseTestController,
  ],
  providers: [
    NavigationService,
    CategoriesService,
    ProductsService,
    ProductDetailService,
    ViewHistoryService,
    ScrapingService,
    AuthService,
    JwtStrategy,
    WishlistService,
    SupabaseTestService,
  ],
})
export class AppModule {
  constructor() {
    console.log('Backend initialized successfully');
  }
}