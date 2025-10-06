import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


export enum ScrapeTargetType {
  NAVIGATION = 'navigation',
  CATEGORY = 'category', 
  PRODUCT = 'product',
  PRODUCT_DETAIL = 'product_detail'
}

export enum ScrapeJobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('scrape_jobs')
export class ScrapeJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  target_url: string;

  @Column({
    type: 'text',
    enum: ScrapeTargetType 
  })
  target_type: ScrapeTargetType; 

  @Column({
    type: 'text', 
    enum: ScrapeJobStatus,
    default: ScrapeJobStatus.PENDING
  })
  status: ScrapeJobStatus;

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  finished_at: Date;

  @Column('text', { nullable: true })
  error_log: string;
}