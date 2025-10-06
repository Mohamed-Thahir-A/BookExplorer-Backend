import { ViewHistoryService } from '../services/view-history.service';
export declare class ViewHistoryController {
    private readonly viewHistoryService;
    constructor(viewHistoryService: ViewHistoryService);
    trackView(trackData: {
        sessionId: string;
        userId?: string;
        path?: string;
        params?: Record<string, any>;
    }): Promise<import("../entities/view-history.entity").ViewHistory>;
    getUserHistory(userId: string, limit: number): Promise<import("../entities/view-history.entity").ViewHistory[]>;
    getSessionHistory(sessionId: string): Promise<import("../entities/view-history.entity").ViewHistory>;
    getRecentActivity(userId: string, limit: number): Promise<{
        session_id: string;
        created_at: Date;
        path: string;
        params: Record<string, any>;
        timestamp: string;
    }[]>;
    getPopularProducts(days: number, limit: number): Promise<any[]>;
    getStatistics(): Promise<{
        totalSessions: number;
        sessionsToday: number;
        uniqueUsers: number;
    }>;
    cleanupOldHistory(days: number): Promise<{
        deletedCount: number;
    }>;
}
