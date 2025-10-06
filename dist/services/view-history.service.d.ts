import { Repository } from 'typeorm';
import { ViewHistory } from '../entities/view-history.entity';
export declare class ViewHistoryService {
    private viewHistoryRepository;
    constructor(viewHistoryRepository: Repository<ViewHistory>);
    trackView(sessionId: string, userId?: string, path?: string, params?: Record<string, any>): Promise<ViewHistory>;
    getUserHistory(userId: string, limit?: number): Promise<ViewHistory[]>;
    getSessionHistory(sessionId: string): Promise<ViewHistory>;
    getRecentActivity(userId: string, limit?: number): Promise<{
        session_id: string;
        created_at: Date;
        path: string;
        params: Record<string, any>;
        timestamp: string;
    }[]>;
    getPopularProducts(days?: number, limit?: number): Promise<any[]>;
    cleanupOldHistory(days?: number): Promise<{
        deletedCount: number;
    }>;
    getStatistics(): Promise<{
        totalSessions: number;
        sessionsToday: number;
        uniqueUsers: number;
    }>;
}
