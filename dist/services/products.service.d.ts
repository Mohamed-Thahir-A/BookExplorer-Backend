import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductDetail } from '../entities/product-detail.entity';
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
    private productDetailRepository;
    private readonly logger;
    constructor(productRepository: Repository<Product>, productDetailRepository: Repository<ProductDetail>);
    findWithFilters(filters: ProductFilters): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    addScrapedProducts(products: Partial<Product>[]): Promise<Product[]>;
    create(product: Partial<Product>): Promise<Product>;
    getProductStats(): Promise<{
        totalProducts: number;
        averagePrice: number;
        averageRating: number;
        topAuthors: Array<{
            author: string;
            count: number;
        }>;
    }>;
    findByCategorySlug(categorySlug: string, page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
        category: any;
    }>;
    getProductsWithCategories(): Promise<Product[]>;
    searchProducts(searchTerm: string, page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getFeaturedProducts(limit?: number): Promise<Product[]>;
    getRecentProducts(limit?: number): Promise<Product[]>;
    updateProductRating(productId: string, rating: number, reviewCount: number): Promise<Product>;
    getProductsByPriceRange(minPrice: number, maxPrice: number, page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getProductsByAuthor(author: string, page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getUniqueAuthors(): Promise<string[]>;
    getPriceRanges(): Promise<{
        min: number;
        max: number;
    }>;
    getProductsGroupedByCategory(): Promise<{
        [category: string]: Product[];
    }>;
    getProductsWithSorting(sortBy?: string, page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
export {};
