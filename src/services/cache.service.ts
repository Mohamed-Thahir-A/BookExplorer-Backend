import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm'; 
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cache_entries')
export class CacheEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column('text')
  value: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Injectable()
export class CacheService {
  constructor(
    @InjectRepository(CacheEntry)
    private cacheRepository: Repository<CacheEntry>,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const entry = await this.cacheRepository.findOne({
      where: { key, expiresAt: MoreThan(new Date()) },
    });

    if (!entry) return null;

    return JSON.parse(entry.value) as T;
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    
    await this.cacheRepository.upsert(
      {
        key,
        value: JSON.stringify(value),
        expiresAt,
      },
      ['key']
    );
  }

  async invalidate(key: string): Promise<void> {
    await this.cacheRepository.delete({ key });
  }

  async clearExpired(): Promise<void> {
    await this.cacheRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}