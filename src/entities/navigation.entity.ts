import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { Category } from './category.entity';

@Entity('navigation')
export class Navigation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @CreateDateColumn()
  last_scraped_at: Date;
 @Column({ nullable: true })  
  url: string;
  @OneToMany(() => Category, category => category.navigation)
  categories: Category[];
}