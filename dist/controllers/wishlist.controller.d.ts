export declare class WishlistController {
    private wishlistItems;
    addToWishlist(req: any, body: any): {
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            id: string;
            user_id: any;
            book_id: any;
            book_title: any;
            book_author: any;
            book_price: any;
            book_image: any;
            book_description: any;
            created_at: string;
        };
    };
    removeFromWishlist(req: any, body: any): {
        success: boolean;
        message: string;
        removed: boolean;
    };
    getWishlist(req: any): any[];
    checkInWishlist(req: any, bookId: string): {
        success: boolean;
        inWishlist: boolean;
        bookId: string;
    };
    test(): {
        success: boolean;
        message: string;
        totalItems: number;
        timestamp: string;
    };
    debug(): {
        success: boolean;
        totalItems: number;
        items: any[];
        timestamp: string;
    };
    clearWishlist(req: any): {
        success: boolean;
        message: string;
        removedCount: number;
    };
}
