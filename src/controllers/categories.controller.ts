import { Controller, Get, Param, HttpException, HttpStatus, Post, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { ScrapingService } from '../services/scraping.service';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../services/products.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(
    private categoriesService: CategoriesService,
    private scrapingService: ScrapingService,
    private productsService: ProductsService
  ) {
   
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Returns all categories', type: [Category] })
  async getCategories(): Promise<{ data: Category[] }> {
    try {
      let categories = await this.categoriesService.findAll();
      
     
      if (categories.length === 0) {
        
        await this.scrapingService.scrapeNavigation();
        categories = await this.categoriesService.findAll();
      }
      
      return { data: categories };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch categories',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get category statistics' })
  @ApiResponse({ status: 200, description: 'Returns category statistics' })
  async getCategoryStats() {
    try {
      const stats = await this.categoriesService.getCategoryStats();
      return { data: stats };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch category statistics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Returns category', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategory(@Param('id') id: string): Promise<{ data: Category }> {
    try {
      const category = await this.categoriesService.findOne(id);
      return { data: category };
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch category',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('update-counts')
  async updateCategoryCounts() {
    return this.categoriesService.updateAllCategoryCounts();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({ status: 200, description: 'Returns category', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryBySlug(@Param('slug') slug: string): Promise<{ data: Category }> {
    try {
      const category = await this.categoriesService.findBySlug(slug);
      return { data: category };
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch category',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  


  @Get('slug/:slug/products')
  @ApiOperation({ summary: 'Get products by category slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({ status: 200, description: 'Returns category products' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryProductsBySlug(@Param('slug') slug: string): Promise<{ data: { category: Category; products: Product[] } }> {
    try {
      const category = await this.categoriesService.findBySlug(slug);
      const products = await this.categoriesService.getCategoryProducts(slug);
      
      return { 
        data: {
          category,
          products
        }
      };
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch category products',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  @Get(':id/products')
  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Returns category products' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryProductsById(@Param('id') id: string): Promise<{ data: { category: Category; products: Product[] } }> {
    try {
      const category = await this.categoriesService.findOne(id);
      const products = await this.categoriesService.getProductsByCategoryId(id);
      
      return { 
        data: {
          category,
          products
        }
      };
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch category products',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

@Post('load-more/:slug')
async loadMoreCategoryBooks(
  @Param('slug') slug: string,
  @Query('page') page: string = '1',
  @Query('currentCount') currentCount: number = 0 
) {
  try {
    const category = await this.categoriesService.findBySlug(slug);
    
    const requestedPage = parseInt(page) || 1;
    
    this.logger.log(`🔄 User requested more books for ${slug}, scraping page ${requestedPage} with ${currentCount} existing books`);

    
    const productsResult = await this.productsService.findByCategorySlug(slug);
    const existingProducts = productsResult.products;

    this.logger.log(`📊 Found ${existingProducts.length} existing products in database for deduplication`);

    const existingTitles = new Set(
      existingProducts.map(product => `${product.title}-${product.author}`.toLowerCase().trim())
    );

    
    const scrapedProducts = await this.scrapingService.scrapeCategoryWithPagination(slug, requestedPage);
    
   
    const newProducts = scrapedProducts.filter(product => {
      const productKey = `${product.title}-${product.author}`.toLowerCase().trim();
      return !existingTitles.has(productKey);
    });

    
    const savedProducts: Product[] = [];
    for (const productData of newProducts) {
      try {
        const savedProduct = await this.productsService.create({
          ...productData,
          category: category
        });
        savedProducts.push(savedProduct);
      } catch (error) {
        this.logger.error(`❌ Failed to save product: ${productData.title}`, error.message);
      }
    }


    const hasMore = scrapedProducts.length > 0; 
    const nextPage = hasMore ? requestedPage + 1 : null;

    this.logger.log(`✅ Live scraping completed: ${savedProducts.length} new books (filtered ${scrapedProducts.length - savedProducts.length} duplicates) for ${category.title}`);

    return {
      data: {
        category,
        products: savedProducts,
        currentPage: requestedPage, 
        hasMore,
        nextPage, 
        message: `Live scraping: Added ${savedProducts.length} fresh books from page ${requestedPage} (filtered ${scrapedProducts.length - savedProducts.length} duplicates)`,
        stats: {
          totalScraped: scrapedProducts.length,
          newProducts: savedProducts.length,
          duplicates: scrapedProducts.length - savedProducts.length
        }
      }
    };
  } catch (error) {
    this.logger.error(`❌ Live scraping failed for ${slug}: ${error.message}`);
    if (error.status === 404) {
      throw error;
    }
    throw new HttpException(
      `Live scraping failed: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
  
  @Post(':id/refresh-books')
  @ApiOperation({ summary: 'Refresh books for a specific category' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Category books refreshed successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async refreshCategoryBooks(@Param('id') id: string): Promise<{ 
    data: { 
      category: Category; 
      products: Product[];
      message: string;
    } 
  }> {
    try {
      const category = await this.categoriesService.findOne(id);
      
      
      const scrapedProducts = await this.scrapingService.scrapeCategoryBooks(category.slug);
      
      return {
        data: {
          category,
          products: scrapedProducts,
          message: `Successfully refreshed ${scrapedProducts.length} books for ${category.title}`
        }
      };
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to refresh category books',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  
  @Post('slug/:slug/refresh-books')
  @ApiOperation({ summary: 'Refresh books for a category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({ status: 200, description: 'Category books refreshed successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async refreshCategoryBooksBySlug(@Param('slug') slug: string): Promise<{ 
    data: { 
      category: Category; 
      products: Product[];
      message: string;
    } 
  }> {
    try {
      const category = await this.categoriesService.findBySlug(slug);
      
      
      const scrapedProducts = await this.scrapingService.scrapeCategoryBooks(slug);
      
      return {
        data: {
          category,
          products: scrapedProducts,
          message: `Successfully refreshed ${scrapedProducts.length} books for ${category.title}`
        }
      };
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to refresh category books',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}











// // categories.controller.ts - ENHANCED VERSION
// import { Controller, Get, Param, Post, HttpException, HttpStatus } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
// import { CategoriesService } from '../services/categories.service';
// import { ScrapingService } from '../services/scraping.service';
// import { Category } from '../entities/category.entity';

// @ApiTags('categories')
// @Controller('categories')
// export class CategoriesController {
//   constructor(
//     private categoriesService: CategoriesService,
//     private scrapingService: ScrapingService,
//   ) {
//     console.log('CategoriesController initialized');
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all categories' })
//   @ApiResponse({ status: 200, description: 'Returns all categories', type: [Category] })
//   async getCategories(): Promise<Category[]> {
//     try {
//       return await this.categoriesService.findAll();
//     } catch (error) {
//       throw new HttpException(
//         'Failed to fetch categories',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   @Get('stats')
//   @ApiOperation({ summary: 'Get category statistics' })
//   @ApiResponse({ status: 200, description: 'Returns category statistics' })
//   async getCategoryStats() {
//     try {
//       return await this.categoriesService.getCategoryStats();
//     } catch (error) {
//       throw new HttpException(
//         'Failed to fetch category statistics',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get category by ID' })
//   @ApiParam({ name: 'id', description: 'Category UUID' })
//   @ApiResponse({ status: 200, description: 'Returns category', type: Category })
//   @ApiResponse({ status: 404, description: 'Category not found' })
//   async getCategory(@Param('id') id: string): Promise<Category> {
//     try {
//       return await this.categoriesService.findOne(id);
//     } catch (error) {
//       if (error.status === 404) {
//         throw error;
//       }
//       throw new HttpException(
//         'Failed to fetch category',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   @Post(':id/refresh')
//   @ApiOperation({ summary: 'Refresh category products by scraping' })
//   @ApiParam({ name: 'id', description: 'Category UUID' })
//   @ApiResponse({ status: 200, description: 'Category refreshed successfully' })
//   async refreshCategory(@Param('id') id: string): Promise<Category> {
//     try {
//       const category = await this.categoriesService.findOne(id);
//       const scrapedData = await this.scrapingService.scrapeCategory(category.slug);
//       return await this.categoriesService.updateFromScrape(id, { products: scrapedData });
//     } catch (error) {
//       throw new HttpException(
//         'Failed to refresh category',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   @Get('slug/:slug')
//   @ApiOperation({ summary: 'Get category by slug' })
//   @ApiParam({ name: 'slug', description: 'Category slug' })
//   @ApiResponse({ status: 200, description: 'Returns category', type: Category })
//   @ApiResponse({ status: 404, description: 'Category not found' })
//   async getCategoryBySlug(@Param('slug') slug: string): Promise<Category> {
//     try {
//       return await this.categoriesService.findBySlug(slug);
//     } catch (error) {
//       if (error.status === 404) {
//         throw error;
//       }
//       throw new HttpException(
//         'Failed to fetch category',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   // Development/Testing endpoints
//   @Post('_dev/sample-data')
//   @ApiOperation({ summary: 'Create sample categories (development only)' })
//   @ApiResponse({ status: 201, description: 'Sample categories created' })
//   async createSampleCategories(): Promise<Category[]> {
//     return await this.categoriesService.createSampleData();
//   }

//   @Post('_dev/clear-all')
//   @ApiOperation({ summary: 'Clear all categories (development only)' })
//   @ApiResponse({ status: 200, description: 'Categories cleared' })
//   async clearAllCategories(): Promise<{ message: string; deletedCount: number }> {
//     return await this.categoriesService.clearAll();
//   }
// }