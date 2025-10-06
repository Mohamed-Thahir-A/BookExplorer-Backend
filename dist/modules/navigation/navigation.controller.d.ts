import { NavigationService } from './navigation.service';
import { ScrapingService } from '../../services/scraping.service';
export declare class NavigationController {
    private readonly navigationService;
    private readonly scrapingService;
    constructor(navigationService: NavigationService, scrapingService: ScrapingService);
    getNavigation(): Promise<any>;
    refreshNavigation(): Promise<any>;
}
