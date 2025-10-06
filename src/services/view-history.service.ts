import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ViewHistory } from '../entities/view-history.entity';

@Injectable()
export class ViewHistoryService {
  constructor(
    @InjectRepository(ViewHistory)
    private viewHistoryRepository: Repository<ViewHistory>,
  ) {}

  async trackView(
    sessionId: string, 
    userId?: string, 
    path?: string, 
    params: Record<string, any> = {}
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let viewHistory = await this.viewHistoryRepository.findOne({
      where: { 
        session_id: sessionId,
        created_at: MoreThan(today)
      },
      order: { created_at: 'DESC' },
    });

    const pathEntry = {
      path: path || '/',
      params,
      timestamp: new Date().toISOString(),
    };

    if (viewHistory) {
      viewHistory.path_json = [...viewHistory.path_json, pathEntry].slice(-50);
      viewHistory.user_id = userId || viewHistory.user_id;
      return this.viewHistoryRepository.save(viewHistory);
    } else {
      const newHistory = this.viewHistoryRepository.create({
        session_id: sessionId,
        user_id: userId,
        path_json: [pathEntry],
      });
      return this.viewHistoryRepository.save(newHistory);
    }
  }

  async getUserHistory(userId: string, limit: number = 50) {
    return this.viewHistoryRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async getSessionHistory(sessionId: string) {
    return this.viewHistoryRepository.findOne({
      where: { session_id: sessionId },
      order: { created_at: 'DESC' },
    });
  }

  async getRecentActivity(userId: string, limit: number = 20) {
    const history = await this.viewHistoryRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });

    const recentActivity = history.flatMap(record => 
      record.path_json.map(entry => ({
        ...entry,
        session_id: record.session_id,
        created_at: record.created_at,
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

    return recentActivity;
  }

  async getPopularProducts(days: number = 7, limit: number = 10) {

    
    console.log(`Getting popular products for last ${days} days, limit: ${limit}`);
    
    return [];
    
  }

  async cleanupOldHistory(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.viewHistoryRepository
      .createQueryBuilder()
      .delete()
      .where('created_at < :cutoffDate', { cutoffDate })
      .execute();

    return { deletedCount: result.affected };
  }

  async getStatistics() {
    const totalSessions = await this.viewHistoryRepository.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionsToday = await this.viewHistoryRepository.count({
      where: { created_at: MoreThan(today) }
    });

    const uniqueUsers = await this.viewHistoryRepository
      .createQueryBuilder('view_history')
      .select('COUNT(DISTINCT user_id)', 'count')
      .where('user_id IS NOT NULL')
      .getRawOne();

    return {
      totalSessions,
      sessionsToday,
      uniqueUsers: parseInt(uniqueUsers.count) || 0,
    };
  }
}