export declare class AddToWishlistDto {
    book_id: string;
    book_title: string;
    book_author: string;
    book_description?: string;
    book_price?: number;
    book_image?: string;
}
export declare class RemoveFromWishlistDto {
    book_id: string;
}
