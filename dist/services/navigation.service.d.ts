import { Repository } from 'typeorm';
import { Navigation } from '../entities/navigation.entity';
import { ScrapeJob } from '../entities/scrape-job.entity';
export declare class NavigationService {
    private navigationRepository;
    private scrapeJobRepository;
    private readonly logger;
    constructor(navigationRepository: Repository<Navigation>, scrapeJobRepository: Repository<ScrapeJob>);
    findAll(includeCategories?: boolean): Promise<Navigation[]>;
    findById(id: string): Promise<Navigation | null>;
    findBySlug(slug: string): Promise<Navigation | null>;
    update(id: string, updateData: Partial<Navigation>): Promise<Navigation | null>;
    delete(id: string): Promise<boolean>;
    findRecentScrapeJob(): Promise<ScrapeJob | null>;
    getTotalCount(): Promise<number>;
    create(navigationData: Partial<Navigation>): Promise<Navigation>;
    updateFromScrape(scrapedData: any[]): Promise<Navigation[]>;
}
