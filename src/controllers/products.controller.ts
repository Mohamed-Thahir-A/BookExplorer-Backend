import { 
  Controller, 
  Get, 
  Param, 
  Post, 
  Query, 
  HttpException, 
  HttpStatus, 
  Logger 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery, 
  ApiParam 
} from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { ScrapingService } from '../services/scraping.service';
import { Product } from '../entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private productsService: ProductsService,
    private scrapingService: ScrapingService,
  ) {
    this.logger.log('ProductsController initialized');
  }

  @Get()
  @ApiOperation({ summary: 'Get products with filters' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'minRating', required: false, description: 'Minimum rating' })
  @ApiQuery({ name: 'category', required: false, description: 'Category slug' })
  @ApiQuery({ name: 'author', required: false, description: 'Author name' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'Returns filtered products' })
  async getProducts(
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
    @Query('category') category?: string,
    @Query('author') author?: string,
    @Query('page') page?: string,
  ): Promise<{ data: Product[] }> {
    try {
      let result = await this.productsService.findWithFilters({
        search,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        category,
        author,
        page: page ? parseInt(page) : 1,
      });
      if (result.products.length === 0) {
      this.logger.log('No products found, triggering automatic scrape...');
      const scrapedProducts = await this.scrapingService.scrapeBooks();
      result = { products: scrapedProducts, total: scrapedProducts.length, page: 1, totalPages: 1 };
    }

      return { data: result.products };
    } catch (error) {
      this.logger.error(`getProducts failed: ${error.message}`, error.stack);
      throw new HttpException(
        `Failed to fetch products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get product statistics' })
  @ApiResponse({ status: 200, description: 'Returns product statistics' })
  async getProductStats(): Promise<{ data: any }> {
    try {
      const stats = await this.productsService.getProductStats();
      return { data: stats };
    } catch (error) {
      this.logger.error(`getProductStats failed: ${error.message}`, error.stack);
      throw new HttpException(
        `Failed to fetch product statistics: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Returns product', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string): Promise<{ data: Product }> {
    try {
      const product = await this.productsService.findOne(id);
      return { data: product };
    } catch (error) {
      this.logger.error(`getProduct(${id}) failed: ${error.message}`, error.stack);
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        `Failed to fetch product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh products by scraping World of Books' })
  @ApiResponse({ status: 201, description: 'Products refreshed successfully' })
  @ApiResponse({ status: 429, description: 'Scraping already in progress' })
  async refreshProducts(): Promise<{ data: Product[]; message: string }> {
    try {
      this.logger.log('Manual refresh triggered via /products/refresh');
      const products = await this.scrapingService.scrapeBooks();
      
      return { 
        data: products,
        message: `Successfully scraped ${products.length} products from World of Books`
      };
    } catch (error) {
      this.logger.error(`refreshProducts failed: ${error.message}`, error.stack);
      if (error.message === 'Scraping already in progress') {
        throw new HttpException(
          'Scraping already in progress. Please wait for current scraping to complete.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        `Failed to refresh products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


