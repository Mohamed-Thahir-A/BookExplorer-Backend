import { SupabaseTestService } from '../services/supabase-test.service';
export declare class SupabaseTestController {
    private readonly supabaseTestService;
    constructor(supabaseTestService: SupabaseTestService);
    testConnection(): Promise<{
        success: boolean;
        message: string;
        counts: {
            products: number;
            categories: number;
            users: number;
        };
        database: string;
        nextStep: string;
        error?: undefined;
        suggestion?: undefined;
    } | {
        success: boolean;
        error: any;
        suggestion: string;
        message?: undefined;
        counts?: undefined;
        database?: undefined;
        nextStep?: undefined;
    }>;
}
