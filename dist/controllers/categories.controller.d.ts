import { CategoriesService } from '../services/categories.service';
import { ScrapingService } from '../services/scraping.service';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../services/products.service';
export declare class CategoriesController {
    private categoriesService;
    private scrapingService;
    private productsService;
    private readonly logger;
    constructor(categoriesService: CategoriesService, scrapingService: ScrapingService, productsService: ProductsService);
    getCategories(): Promise<{
        data: Category[];
    }>;
    getCategoryStats(): Promise<{
        data: {
            totalCategories: number;
            totalProducts: number;
            categoriesWithProducts: number;
        };
    }>;
    getCategory(id: string): Promise<{
        data: Category;
    }>;
    updateCategoryCounts(): Promise<{
        message: string;
    }>;
    getCategoryBySlug(slug: string): Promise<{
        data: Category;
    }>;
    getCategoryProductsBySlug(slug: string): Promise<{
        data: {
            category: Category;
            products: Product[];
        };
    }>;
    getCategoryProductsById(id: string): Promise<{
        data: {
            category: Category;
            products: Product[];
        };
    }>;
    loadMoreCategoryBooks(slug: string, page?: string, currentCount?: number): Promise<{
        data: {
            category: Category;
            products: Product[];
            currentPage: number;
            hasMore: boolean;
            nextPage: number;
            message: string;
            stats: {
                totalScraped: number;
                newProducts: number;
                duplicates: number;
            };
        };
    }>;
    refreshCategoryBooks(id: string): Promise<{
        data: {
            category: Category;
            products: Product[];
            message: string;
        };
    }>;
    refreshCategoryBooksBySlug(slug: string): Promise<{
        data: {
            category: Category;
            products: Product[];
            message: string;
        };
    }>;
}
