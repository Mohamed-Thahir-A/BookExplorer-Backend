import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
interface ProductFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    category?: string;
    author?: string;
    page?: number;
    limit?: number;
}
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    findWithFilters(filters: ProductFilters): Promise<{
        products: Product[];
        total: number;
        page: number;
    }>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    create(product: Partial<Product>): Promise<Product>;
}
export {};
