import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    updateFromScrape(id: string, scrapedData: any): Promise<Category>;
}
