import { Navigation } from '../entities/navigation.entity';
import { ScrapingService } from '../services/scraping.service';
import { NavigationService } from '../services/navigation.service';
export declare class NavigationController {
    private scrapingService;
    private navigationService;
    private readonly logger;
    constructor(scrapingService: ScrapingService, navigationService: NavigationService);
    getNavigation(includeCategories?: boolean): Promise<{
        data: Navigation[];
    }>;
    getNavigationById(id: string): Promise<{
        data: Navigation;
    }>;
    refreshNavigation(): Promise<{
        data: Navigation[];
    }>;
    updateNavigation(id: string, updateData: Partial<Navigation>): Promise<{
        data: Navigation;
    }>;
    deleteNavigation(id: string): Promise<{
        data: {
            message: string;
        };
    }>;
    getNavigationBySlug(slug: string): Promise<{
        data: Navigation;
    }>;
    getScrapeStatus(): Promise<{
        data: {
            isScraping: boolean;
            lastScrape: Date | null;
            totalItems: number;
        };
    }>;
    private isJobTooRecent;
    private isJobRunning;
}
