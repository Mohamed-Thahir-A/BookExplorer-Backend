import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { ViewHistory } from './view-history.entity';
import { Wishlist } from './wishlist.entity';

@Entity('users')
@Index(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ default: true })
  is_verified: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ nullable: true })
  reset_password_token: string;

  @Column({ nullable: true })
  reset_password_expires: Date;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => ViewHistory, viewHistory => viewHistory.user)
  view_history: ViewHistory[];

  @OneToMany(() => Wishlist, wishlist => wishlist.user)
  wishlist: Wishlist[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}