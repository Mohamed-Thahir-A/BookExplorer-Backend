import { Repository } from 'typeorm';
import { Navigation } from '../../entities/navigation.entity';
export declare class NavigationService {
    private navigationRepository;
    constructor(navigationRepository: Repository<Navigation>);
    findAll(): Promise<Navigation[]>;
    findOne(id: string): Promise<Navigation>;
    updateFromScrape(scrapedData: any): Promise<Navigation[]>;
    private getMockNavigation;
    seedInitialData(): Promise<Navigation[]>;
}
