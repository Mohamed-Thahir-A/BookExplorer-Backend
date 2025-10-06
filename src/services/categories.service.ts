import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {
    this.logger.log('CategoriesService initialized');
  }

  async findAll(): Promise<Category[]> {
    try {
      const categories = await this.categoriesRepository.find({
        relations: ['navigation', 'parent', 'children'],
        order: { title: 'ASC' },
      });
      
      this.logger.log(`Found ${categories.length} categories in database`);
      return categories;
      
    } catch (error) {
      this.logger.error(`Error finding categories: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['navigation', 'parent', 'children', 'products'],
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['navigation', 'parent', 'children'],
    });
    
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    
    return category;
  }


  async getCategoryProducts(slug: string): Promise<Product[]> {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { slug },
      });
      
      if (!category) {
        throw new NotFoundException(`Category with slug ${slug} not found`);
      }
      
      const products = await this.productsRepository.find({
        where: { category_id: category.id },
        relations: ['category'],
        order: { last_scraped_at: 'DESC' },
      });
      
      this.logger.log(`Found ${products.length} products for category ${slug}`);
      return products;
      
    } catch (error) {
      this.logger.error(`Error getting products for category ${slug}: ${error.message}`);
      throw error;
    }
  }


  async getProductsByCategoryId(categoryId: string): Promise<Product[]> {
    try {
      const products = await this.productsRepository.find({
        where: { category_id: categoryId },
        relations: ['category'],
        order: { last_scraped_at: 'DESC' },
      });
      
      this.logger.log(`Found ${products.length} products for category ID ${categoryId}`);
      return products;
      
    } catch (error) {
      this.logger.error(`Error getting products for category ID ${categoryId}: ${error.message}`);
      throw error;
    }
  }

  async updateFromScrape(id: string, scrapedData: any): Promise<Category> {
    const category = await this.findOne(id);
    
    if (scrapedData.products) {
      category.product_count = scrapedData.products.length;
    }
    
    Object.assign(category, scrapedData);
    
    return await this.categoriesRepository.save(category);
  }

  async clearAll(): Promise<{ message: string; deletedCount: number }> {
    const result = await this.categoriesRepository.delete({});
    this.logger.log(`Cleared ${result.affected} categories`);
    
    return { 
      message: 'All categories cleared successfully',
      deletedCount: result.affected || 0
    };
  }

  async getCategoryStats(): Promise<{
    totalCategories: number;
    totalProducts: number;
    categoriesWithProducts: number;
  }> {
    const totalCategories = await this.categoriesRepository.count();
    
    const stats = await this.categoriesRepository
      .createQueryBuilder('category')
      .select('SUM(category.product_count)', 'totalProducts')
      .addSelect('COUNT(CASE WHEN category.product_count > 0 THEN 1 END)', 'categoriesWithProducts')
      .getRawOne();
    
    return {
      totalCategories,
      totalProducts: parseInt(stats.totalProducts) || 0,
      categoriesWithProducts: parseInt(stats.categoriesWithProducts) || 0,
    };
  }
  async updateAllCategoryCounts() {
  const categories = await this.categoriesRepository.find();
  
  for (const category of categories) {
    const count = await this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.category', 'category')
      .where('category.id = :categoryId', { categoryId: category.id })
      .getCount();
    
    category.product_count = count;
    await this.categoriesRepository.save(category);
    console.log(`Updated ${category.title}: ${count} products`);
  }
  
  return { message: 'Category counts updated successfully' };
}



async updateCategoryAfterScraping(categoryId: string, newProductsCount: number): Promise<Category> {
  const category = await this.findOne(categoryId);

  const currentCount = await this.productsRepository.count({
    where: { category_id: categoryId }
  });
  
  category.product_count = currentCount;
  await this.categoriesRepository.save(category);
  
  this.logger.log(`Updated category ${category.title} product count to ${currentCount}`);
  return category;
}


  async createFromScrape(scrapedCategories: any[]): Promise<Category[]> {
    this.logger.log(`Creating ${scrapedCategories.length} categories from scraped data`);
    
    const createdCategories: Category[] = [];
    
    for (const categoryData of scrapedCategories) {
      try {
  
        let category = await this.categoriesRepository.findOne({
          where: { slug: categoryData.slug }
        });
        
        if (!category) {
    
          category = this.categoriesRepository.create({
            title: categoryData.title,
            slug: categoryData.slug,
            product_count: 0,
          });
          
          category = await this.categoriesRepository.save(category);
          createdCategories.push(category);
          this.logger.log(`Created category from scrape: ${categoryData.title}`);
        } else {
         
          await this.categoriesRepository.update(category.id, {
            title: categoryData.title,
            last_scraped_at: new Date(),
          });
          createdCategories.push(category);
          this.logger.log(`Updated category from scrape: ${categoryData.title}`);
        }
      } catch (error) {
        this.logger.error(`Error creating category "${categoryData.title}": ${error.message}`);
      }
    }
    
    return createdCategories;
  }
}


