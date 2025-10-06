import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from '../controllers/categories.controller';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { ScrapingService } from '../services/scraping.service';
import { ScrapeJob } from '../entities/scrape-job.entity'; 
import { Navigation } from '../entities/navigation.entity'; 
import { Product } from '../entities/product.entity'; 
@Module({
  imports: [TypeOrmModule.forFeature([
    Category, 
    ScrapeJob,   
    Navigation,
    Product

  ])],
  controllers: [CategoriesController],
  providers: [CategoriesService, ScrapingService],
})
export class CategoriesModule {}