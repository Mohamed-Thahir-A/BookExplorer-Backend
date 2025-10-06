import { CategoriesService } from './categories.service';
import { ScrapingService } from '../../services/scraping.service';
export declare class CategoriesController {
    private readonly categoriesService;
    private readonly scrapingService;
    constructor(categoriesService: CategoriesService, scrapingService: ScrapingService);
    getCategories(): Promise<import("../../entities/category.entity").Category[]>;
    getCategory(id: string): Promise<import("../../entities/category.entity").Category>;
    refreshCategory(id: string): Promise<import("../../entities/category.entity").Category>;
}
