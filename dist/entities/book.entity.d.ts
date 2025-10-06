import { Wishlist } from './wishlist.entity';
export declare class Book {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    image_url: string;
    isbn: string;
    wishlist: Wishlist[];
    created_at: Date;
    updated_at: Date;
}
