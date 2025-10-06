import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SupabaseTestService } from './services/supabase-test.service';
import { SupabaseTestController } from './controllers/supabase-test.controller';

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
    // Global environment configuration
    ConfigModule.forRoot({ isGlobal: true }),

    // JWT setup using ConfigService (fixed injection error)
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d' },
      }),
      inject: [ConfigService], // <-- THIS MUST BE ConfigService, not ConfigModule
    }),

    PassportModule,

    // Global cache
    CacheModule.register({
      isGlobal: true,
      ttl: 300000,
      max: 100,
    }),
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
    console.log('✅ Backend initialized successfully with Supabase JS client');
  }
}
