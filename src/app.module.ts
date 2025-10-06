import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SupabaseTestService } from './services/supabase-test.service';
import { SupabaseTestController } from './controllers/supabase-test.controller';

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
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
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
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        // Add this extra configuration to force IPv4
        const extraConfig = {
          extra: {
            family: 4, // Force IPv4 only
            connectionTimeoutMillis: 10000, // 10 second timeout
          }
        };
        
        if (databaseUrl) {
          // Use DATABASE_URL if provided (recommended for production)
          return {
            type: 'postgres',
            url: databaseUrl,
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
            synchronize: false,
            logging: false,
            ssl: {
              rejectUnauthorized: false,
            },
            ...extraConfig, // Add the IPv4 fix here
          };
        }
        
        // Fallback to individual environment variables
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT', '5432'), 10),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
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
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          logging: configService.get('DB_LOGGING') === 'true',
          ssl: {
            rejectUnauthorized: false,
          },
          ...extraConfig, // Add the IPv4 fix here too
        };
      },
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