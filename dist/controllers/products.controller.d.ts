import { ProductsService } from '../services/products.service';
import { ScrapingService } from '../services/scraping.service';
import { Product } from '../entities/product.entity';
export declare class ProductsController {
    private productsService;
    private scrapingService;
    private readonly logger;
    constructor(productsService: ProductsService, scrapingService: ScrapingService);
    getProducts(search?: string, minPrice?: string, maxPrice?: string, minRating?: string, category?: string, author?: string, page?: string): Promise<{
        data: Product[];
    }>;
    getProductStats(): Promise<{
        data: any;
    }>;
    getProduct(id: string): Promise<{
        data: Product;
    }>;
    refreshProducts(): Promise<{
        data: Product[];
        message: string;
    }>;
}
