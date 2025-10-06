import { Category } from './category.entity';
export declare class Navigation {
    id: string;
    title: string;
    slug: string;
    last_scraped_at: Date;
    url: string;
    categories: Category[];
}
