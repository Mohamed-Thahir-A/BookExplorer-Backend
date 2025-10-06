import { Product } from './product.entity';
export declare class Review {
    id: string;
    product: Product;
    product_id: string;
    author: string;
    rating: number;
    text: string;
    created_at: Date;
}
