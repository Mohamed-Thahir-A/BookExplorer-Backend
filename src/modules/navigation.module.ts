import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigationController } from '../controllers/navigation.controller';
import { NavigationService } from '../services/navigation.service';
import { Navigation } from '../entities/navigation.entity';
import { ScrapingService } from '../services/scraping.service';
import { ScrapeJob } from '../entities/scrape-job.entity';
import { Category } from '../entities/category.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([
    Navigation,
    ScrapeJob,
    Category
  ])],
  controllers: [NavigationController],
  providers: [NavigationService, ScrapingService],
  exports: [NavigationService],
})
export class NavigationModule {}