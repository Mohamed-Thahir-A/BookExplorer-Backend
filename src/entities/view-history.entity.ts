import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,ManyToOne , JoinColumn} from 'typeorm';
import { User } from './user.entity';

@Entity('view_history')
export class ViewHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.view_history, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  user_id: string;

  @Column()
  session_id: string;

  @Column('simple-json')
  path_json: {
    path: string;
    params: Record<string, any>;
    timestamp: string;
  }[];

  @CreateDateColumn()
  created_at: Date;
}