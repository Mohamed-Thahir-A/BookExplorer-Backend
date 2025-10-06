import { ProductsService } from './products.service';
import { ScrapingService } from '../../services/scraping.service';
import { Product } from '../../entities/product.entity';
export declare class ProductsController {
    private productsService;
    private scrapingService;
    constructor(productsService: ProductsService, scrapingService: ScrapingService);
    getProducts(search?: string, minPrice?: number, maxPrice?: number, minRating?: number, category?: string, author?: string, page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
        page: number;
    }>;
    getProduct(id: string): Promise<Product>;
    refreshProducts(): Promise<Product[]>;
}
