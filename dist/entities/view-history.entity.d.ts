import { User } from './user.entity';
export declare class ViewHistory {
    id: string;
    user: User;
    user_id: string;
    session_id: string;
    path_json: {
        path: string;
        params: Record<string, any>;
        timestamp: string;
    }[];
    created_at: Date;
}
