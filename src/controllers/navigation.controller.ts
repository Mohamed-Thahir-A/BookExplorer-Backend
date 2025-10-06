import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  HttpException, 
  HttpStatus,
  Logger 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Navigation } from '../entities/navigation.entity';
import { ScrapingService } from '../services/scraping.service';
import { NavigationService } from '../services/navigation.service';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
  private readonly logger = new Logger(NavigationController.name);

  constructor(
    private scrapingService: ScrapingService,
    private navigationService: NavigationService,
  ) {
    console.log('✅ NavigationController initialized!');
    console.log('   - ScrapingService:', !!this.scrapingService);
    console.log('   - NavigationService:', !!this.navigationService);
  }

  @Get()
  @ApiOperation({ summary: 'Get all navigation items' })
  @ApiQuery({ name: 'includeCategories', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns all navigation items', type: [Navigation] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getNavigation(
    @Query('includeCategories') includeCategories?: boolean,
  ): Promise<{ data: Navigation[] }> {
    console.log('🔍 GET /api/navigation called');
    try {
      this.logger.log('Fetching navigation items');
      
      const navigation = await this.navigationService.findAll(includeCategories);
      console.log(`📊 Found ${navigation.length} navigation items`);
      
      if (navigation.length === 0) {
        console.log('🔄 No navigation found, triggering initial scrape');
        this.logger.log('No navigation found, triggering initial scrape');
        const scrapedNav = await this.scrapingService.scrapeNavigation();
        return { data: scrapedNav };
      }
      
      return { data: navigation };
    } catch (error) {
      console.error('❌ Error in getNavigation:', error);
      this.logger.error(`Failed to fetch navigation: ${error.message}`);
      throw new HttpException(
        'Failed to fetch navigation items',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get navigation item by ID' })
  @ApiParam({ name: 'id', description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Returns navigation item', type: Navigation })
  @ApiResponse({ status: 404, description: 'Navigation item not found' })
  async getNavigationById(@Param('id') id: string): Promise<{ data: Navigation }> {
    console.log(`🔍 GET /api/navigation/${id} called`);
    try {
      this.logger.log(`Fetching navigation item with ID: ${id}`);
      
      const navigation = await this.navigationService.findById(id);
      
      if (!navigation) {
        throw new HttpException('Navigation item not found', HttpStatus.NOT_FOUND);
      }
      
      return { data: navigation };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Failed to fetch navigation item ${id}: ${error.message}`);
      throw new HttpException(
        'Failed to fetch navigation item',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh navigation data by scraping World of Books' })
  @ApiResponse({ status: 201, description: 'Navigation data refreshed successfully', type: [Navigation] })
  @ApiResponse({ status: 429, description: 'Too many scrape requests' })
  @ApiResponse({ status: 500, description: 'Scraping failed' })
  async refreshNavigation(): Promise<{ data: Navigation[] }> {
    console.log('🔄 POST /api/navigation/refresh called');
    try {
      this.logger.log('Starting navigation data refresh');
      
      // Check if a scrape job is already running
      const recentJob = await this.navigationService.findRecentScrapeJob();
      if (recentJob && this.isJobTooRecent(recentJob.started_at)) {
        throw new HttpException(
          'Scrape job already running recently. Please wait before starting another.',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
      
      const scrapedNavigation = await this.scrapingService.scrapeNavigation();
      
      this.logger.log(`Successfully refreshed ${scrapedNavigation.length} navigation items`);
      console.log(`✅ Navigation refresh completed with ${scrapedNavigation.length} items`);
      
      return { data: scrapedNavigation };
    } catch (error) {
      console.error('❌ Error in refreshNavigation:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Navigation refresh failed: ${error.message}`);
      throw new HttpException(
        'Failed to refresh navigation data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update navigation item' })
  @ApiParam({ name: 'id', description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Navigation item updated', type: Navigation })
  @ApiResponse({ status: 404, description: 'Navigation item not found' })
  async updateNavigation(
    @Param('id') id: string,
    @Body() updateData: Partial<Navigation>,
  ): Promise<{ data: Navigation }> {
    console.log(`✏️ PUT /api/navigation/${id} called`);
    try {
      this.logger.log(`Updating navigation item ${id}`);
      
      const updated = await this.navigationService.update(id, updateData);
      
      if (!updated) {
        throw new HttpException('Navigation item not found', HttpStatus.NOT_FOUND);
      }
      
      return { data: updated };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Failed to update navigation item ${id}: ${error.message}`);
      throw new HttpException(
        'Failed to update navigation item',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete navigation item' })
  @ApiParam({ name: 'id', description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Navigation item deleted' })
  @ApiResponse({ status: 404, description: 'Navigation item not found' })
  async deleteNavigation(@Param('id') id: string): Promise<{ data: { message: string } }> {
    console.log(`🗑️ DELETE /api/navigation/${id} called`);
    try {
      this.logger.log(`Deleting navigation item ${id}`);
      
      const deleted = await this.navigationService.delete(id);
      
      if (!deleted) {
        throw new HttpException('Navigation item not found', HttpStatus.NOT_FOUND);
      }
      
      return { data: { message: 'Navigation item deleted successfully' } };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Failed to delete navigation item ${id}: ${error.message}`);
      throw new HttpException(
        'Failed to delete navigation item',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get navigation item by slug' })
  @ApiParam({ name: 'slug', description: 'Navigation slug' })
  @ApiResponse({ status: 200, description: 'Returns navigation item', type: Navigation })
  @ApiResponse({ status: 404, description: 'Navigation item not found' })
  async getNavigationBySlug(@Param('slug') slug: string): Promise<{ data: Navigation }> {
    console.log(`🔍 GET /api/navigation/slug/${slug} called`);
    try {
      this.logger.log(`Fetching navigation item with slug: ${slug}`);
      
      const navigation = await this.navigationService.findBySlug(slug);
      
      if (!navigation) {
        throw new HttpException('Navigation item not found', HttpStatus.NOT_FOUND);
      }
      
      return { data: navigation };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Failed to fetch navigation item by slug ${slug}: ${error.message}`);
      throw new HttpException(
        'Failed to fetch navigation item',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('scrape-status')
  @ApiOperation({ summary: 'Get current scraping status' })
  @ApiResponse({ status: 200, description: 'Returns scrape status' })
  async getScrapeStatus(): Promise<{ data: { 
    isScraping: boolean; 
    lastScrape: Date | null;
    totalItems: number;
  } }> {
    console.log('📊 POST /api/navigation/scrape-status called');
    try {
      const recentJob = await this.navigationService.findRecentScrapeJob();
      const totalItems = await this.navigationService.getTotalCount();
      
      return {
        data: {
          isScraping: recentJob ? this.isJobRunning(recentJob.started_at) : false,
          lastScrape: recentJob?.started_at || null,
          totalItems,
        }
      };
    } catch (error) {
      this.logger.error(`Failed to get scrape status: ${error.message}`);
      throw new HttpException(
        'Failed to get scrape status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private isJobTooRecent(startedAt: Date): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return startedAt > fiveMinutesAgo;
  }

  private isJobRunning(startedAt: Date): boolean {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    return startedAt > thirtyMinutesAgo;
  }
}

