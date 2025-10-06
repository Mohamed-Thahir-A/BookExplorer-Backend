import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, Index, JoinColumn } from 'typeorm';
import { Navigation } from './navigation.entity';
import { Product } from './product.entity';

@Entity('categories')
@Index(['last_scraped_at'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ default: 0 })
  product_count: number;

  @ManyToOne(() => Navigation, navigation => navigation.categories)
  @JoinColumn({ name: 'navigation_id' })
  navigation: Navigation;

  @Column({nullable: true })
  navigation_id: string;

  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @Column({ nullable: true })
  parent_id: string;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @CreateDateColumn()
  last_scraped_at: Date;
}