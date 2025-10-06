import { ScrapingService } from '../services/scraping.service';
export declare class DebugController {
    private readonly scrapingService;
    constructor(scrapingService: ScrapingService);
    test(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    debugNavigation(): Promise<import("../entities/navigation.entity").Navigation[] | {
        error: any;
    }>;
    debugBooks(): Promise<import("../entities/product.entity").Product[] | {
        error: any;
    }>;
    scrapeNavigation(): Promise<import("../entities/navigation.entity").Navigation[] | {
        error: any;
    }>;
    scrapeBooks(): Promise<import("../entities/product.entity").Product[] | {
        error: any;
    }>;
}
