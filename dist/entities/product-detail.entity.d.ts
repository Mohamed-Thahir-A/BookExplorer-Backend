import { Product } from './product.entity';
export declare class ProductDetail {
    product_id: string;
    product: Product;
    isbn: string;
    description: string;
    specs: object | null;
    ratings_avg: number;
    reviews_count: number;
}
