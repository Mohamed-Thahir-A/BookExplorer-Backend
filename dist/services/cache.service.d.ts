import { Repository } from 'typeorm';
export declare class CacheEntry {
    id: number;
    key: string;
    value: string;
    expiresAt: Date;
    createdAt: Date;
}
export declare class CacheService {
    private cacheRepository;
    constructor(cacheRepository: Repository<CacheEntry>);
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    invalidate(key: string): Promise<void>;
    clearExpired(): Promise<void>;
}
