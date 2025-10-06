import { ViewHistory } from './view-history.entity';
import { Wishlist } from './wishlist.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
    verification_token: string;
    reset_password_token: string;
    reset_password_expires: Date;
    role: string;
    view_history: ViewHistory[];
    wishlist: Wishlist[];
    created_at: Date;
    updated_at: Date;
}
