"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wishlist_entity_1 = require("../entities/wishlist.entity");
const book_entity_1 = require("../entities/book.entity");
let WishlistService = class WishlistService {
    constructor(wishlistRepository, bookRepository) {
        this.wishlistRepository = wishlistRepository;
        this.bookRepository = bookRepository;
    }
    async addToWishlist(userId, addToWishlistDto) {
        const { book_id } = addToWishlistDto;
        const book = await this.bookRepository.findOne({ where: { id: book_id } });
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        const existing = await this.wishlistRepository.findOne({
            where: {
                userId: userId,
                bookId: book_id
            }
        });
        if (existing) {
            throw new common_1.ConflictException('Book already in wishlist');
        }
        const wishlistItem = this.wishlistRepository.create({
            userId: userId,
            bookId: book_id
        });
        await this.wishlistRepository.save(wishlistItem);
        return { message: 'Book added to wishlist successfully' };
    }
    async removeFromWishlist(userId, removeFromWishlistDto) {
        const { book_id } = removeFromWishlistDto;
        const result = await this.wishlistRepository.delete({
            userId: userId,
            bookId: book_id
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Book not found in wishlist');
        }
        return { message: 'Book removed from wishlist successfully' };
    }
    async getUserWishlist(userId) {
        const wishlist = await this.wishlistRepository.find({
            where: { userId: userId },
            relations: ['book'],
            order: { createdAt: 'DESC' }
        });
        return wishlist.map(item => ({
            id: item.id,
            book: item.book,
            created_at: item.createdAt
        }));
    }
    async checkInWishlist(userId, bookId) {
        const item = await this.wishlistRepository.findOne({
            where: {
                userId: userId,
                bookId: bookId
            }
        });
        return { inWishlist: !!item };
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wishlist_entity_1.Wishlist)),
    __param(1, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map