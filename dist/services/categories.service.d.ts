import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
export declare class CategoriesService {
    private categoriesRepository;
    private productsRepository;
    private readonly logger;
    constructor(categoriesRepository: Repository<Category>, productsRepository: Repository<Product>);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    getCategoryProducts(slug: string): Promise<Product[]>;
    getProductsByCategoryId(categoryId: string): Promise<Product[]>;
    updateFromScrape(id: string, scrapedData: any): Promise<Category>;
    clearAll(): Promise<{
        message: string;
        deletedCount: number;
    }>;
    getCategoryStats(): Promise<{
        totalCategories: number;
        totalProducts: number;
        categoriesWithProducts: number;
    }>;
    updateAllCategoryCounts(): Promise<{
        message: string;
    }>;
    updateCategoryAfterScraping(categoryId: string, newProductsCount: number): Promise<Category>;
    createFromScrape(scrapedCategories: any[]): Promise<Category[]>;
}
