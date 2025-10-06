import { User } from './user.entity';
import { Book } from './book.entity';
export declare class Wishlist {
    id: string;
    user: User;
    userId: string;
    book: Book;
    bookId: string;
    createdAt: Date;
    updatedAt: Date;
}
