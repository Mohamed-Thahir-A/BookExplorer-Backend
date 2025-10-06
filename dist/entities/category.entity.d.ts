import { Navigation } from './navigation.entity';
import { Product } from './product.entity';
export declare class Category {
    id: string;
    title: string;
    slug: string;
    product_count: number;
    navigation: Navigation;
    navigation_id: string;
    parent: Category;
    parent_id: string;
    children: Category[];
    products: Product[];
    last_scraped_at: Date;
}
