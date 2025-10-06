import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Book } from '../entities/book.entity';
import { AddToWishlistDto, RemoveFromWishlistDto } from '../dto/wishlist.dto';
export declare class WishlistService {
    private wishlistRepository;
    private bookRepository;
    constructor(wishlistRepository: Repository<Wishlist>, bookRepository: Repository<Book>);
    addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto): Promise<{
        message: string;
    }>;
    removeFromWishlist(userId: string, removeFromWishlistDto: RemoveFromWishlistDto): Promise<{
        message: string;
    }>;
    getUserWishlist(userId: string): Promise<any[]>;
    checkInWishlist(userId: string, bookId: string): Promise<{
        inWishlist: boolean;
    }>;
}
