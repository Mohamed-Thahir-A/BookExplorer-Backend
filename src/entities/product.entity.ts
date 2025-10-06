import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, CreateDateColumn, Index, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { ProductDetail } from './product-detail.entity';


@Entity('products')
@Index(['source_id'])
@Index(['last_scraped_at'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  source_id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  
  @Column({ nullable: true })
  isbn: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column()
  image_url: string;

  @Column()
  source_url: string;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;
   @Column() 
  author: string;
   @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ nullable: true, length: 100 })
  publisher: string;

  @Column({ nullable: true })
  review_count: number;

  @OneToOne(() => ProductDetail, detail => detail.product)
  detail: ProductDetail;
  
 @Column({ nullable: true, length: 50 })
  format: string;



  @CreateDateColumn()
  last_scraped_at: Date;
}