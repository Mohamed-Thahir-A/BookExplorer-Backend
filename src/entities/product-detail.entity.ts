import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_details')
export class ProductDetail {
  @PrimaryColumn()
  product_id: string;

  @OneToOne(() => Product, product => product.detail)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  isbn: string; 

  @Column({ 
  type: 'text', 
  nullable: true, 
  default: 'No description available' 
})
description: string;

@Column({ type: 'jsonb', nullable: true })  
specs: object | null;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  ratings_avg: number;

  @Column({ default: 0 })
  reviews_count: number;
}