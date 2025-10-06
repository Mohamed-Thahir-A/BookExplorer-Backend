import { Controller, Get, Post } from '@nestjs/common';
import { ScrapingService } from '../services/scraping.service';

@Controller('debug') 
export class DebugController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Get('test')
  async test() {
    return { message: 'Debug endpoint working', timestamp: new Date() };
  }

  @Get('navigation')
  async debugNavigation() {
    try {
      return await this.scrapingService.scrapeNavigation(true);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('books')
  async debugBooks() {
    try {
      return await this.scrapingService.scrapeBooks(true);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('scrape-navigation')
  async scrapeNavigation() {
    try {
      return await this.scrapingService.scrapeNavigation(true);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('scrape-books')
  async scrapeBooks() {
    try {
      return await this.scrapingService.scrapeBooks(true);
    } catch (error) {
      return { error: error.message };
    }
  }
}