import { Category } from './category.entity';
import { ProductDetail } from './product-detail.entity';
export declare class Product {
    id: string;
    source_id: string;
    title: string;
    price: number;
    isbn: string;
    currency: string;
    image_url: string;
    source_url: string;
    category: Category;
    category_id: string;
    author: string;
    description: string;
    rating: number;
    publisher: string;
    review_count: number;
    detail: ProductDetail;
    format: string;
    last_scraped_at: Date;
}
