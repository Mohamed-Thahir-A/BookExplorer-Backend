import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../entities/navigation.entity';
import { ScrapeJob, ScrapeTargetType } from '../entities/scrape-job.entity';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);

  constructor(
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
    
    @InjectRepository(ScrapeJob)
    private scrapeJobRepository: Repository<ScrapeJob>,
  ) {
    console.log('✅ NavigationService initialized!');
    console.log('   - NavigationRepository:', !!this.navigationRepository);
    console.log('   - ScrapeJobRepository:', !!this.scrapeJobRepository);
  }

  async findAll(includeCategories: boolean = false): Promise<Navigation[]> {
    console.log(`🔍 NavigationService.findAll called (includeCategories: ${includeCategories})`);
    const relations: any = {};
    
    if (includeCategories) {
      relations.categories = true;
    }

    const result = await this.navigationRepository.find({
      relations,
      order: { title: 'ASC' },
    });
    
    console.log(`📊 NavigationService found ${result.length} items`);
    return result;
  }

  async findById(id: string): Promise<Navigation | null> {
    console.log(`🔍 NavigationService.findById called for: ${id}`);
    const result = await this.navigationRepository.findOne({
      where: { id },
      relations: { categories: true },
    });
    console.log(`📊 NavigationService findById result: ${result ? 'FOUND' : 'NOT FOUND'}`);
    return result;
  }

  async findBySlug(slug: string): Promise<Navigation | null> {
    console.log(`🔍 NavigationService.findBySlug called for: ${slug}`);
    const result = await this.navigationRepository.findOne({
      where: { slug },
      relations: { categories: true },
    });
    console.log(`📊 NavigationService findBySlug result: ${result ? 'FOUND' : 'NOT FOUND'}`);
    return result;
  }

  async update(id: string, updateData: Partial<Navigation>): Promise<Navigation | null> {
    console.log(`✏️ NavigationService.update called for: ${id}`);
    await this.navigationRepository.update(id, {
      ...updateData,
      last_scraped_at: new Date(),
    });
    
    const result = await this.findById(id);
    console.log(`📊 NavigationService update result: ${result ? 'SUCCESS' : 'FAILED'}`);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    console.log(`🗑️ NavigationService.delete called for: ${id}`);
    const result = await this.navigationRepository.delete(id);
    const success = result.affected > 0;
    console.log(`📊 NavigationService delete result: ${success ? 'SUCCESS' : 'FAILED'}`);
    return success;
  }

  async findRecentScrapeJob(): Promise<ScrapeJob | null> {
    console.log('🔍 NavigationService.findRecentScrapeJob called');
    const result = await this.scrapeJobRepository.findOne({
      where: { target_type: ScrapeTargetType.NAVIGATION },
      order: { started_at: 'DESC' },
    });
    console.log(`📊 NavigationService findRecentScrapeJob result: ${result ? 'FOUND' : 'NOT FOUND'}`);
    return result;
  }

  async getTotalCount(): Promise<number> {
    console.log('🔍 NavigationService.getTotalCount called');
    const count = await this.navigationRepository.count();
    console.log(`📊 NavigationService total count: ${count}`);
    return count;
  }

  async create(navigationData: Partial<Navigation>): Promise<Navigation> {
    console.log('📝 NavigationService.create called');
    const navigation = this.navigationRepository.create({
      ...navigationData,
      last_scraped_at: new Date(),
    });
    
    const result = await this.navigationRepository.save(navigation);
    console.log(`📊 NavigationService create result: SUCCESS (ID: ${result.id})`);
    return result;
  }

  async updateFromScrape(scrapedData: any[]): Promise<Navigation[]> {
    console.log(`🔄 NavigationService.updateFromScrape called with ${scrapedData.length} items`);
    
    const navigations: Navigation[] = [];
    
    for (const item of scrapedData) {
      let navigation = await this.navigationRepository.findOne({
        where: { slug: item.slug }
      });

      if (navigation) {
       
        await this.navigationRepository.update(navigation.id, {
          title: item.title,
          last_scraped_at: new Date(),
        });
        navigation = await this.findById(navigation.id);
        console.log(`🔄 Updated navigation: ${item.title}`);
      } else {
        
        navigation = await this.create({
          title: item.title,
          slug: item.slug,
        });
        console.log(`💾 Created navigation: ${item.title}`);
      }
      
      if (navigation) {
        navigations.push(navigation);
      }
    }
    
    console.log(`✅ NavigationService.updateFromScrape completed: ${navigations.length} items processed`);
    return navigations;
  }
}