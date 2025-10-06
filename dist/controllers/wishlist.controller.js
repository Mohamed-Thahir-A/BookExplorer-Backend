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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let WishlistController = class WishlistController {
    constructor() {
        this.wishlistItems = [];
    }
    addToWishlist(req, body) {
        console.log('🎯 ADD TO WISHLIST CALLED:', body);
        console.log('👤 User ID:', req.user.id);
        const exists = this.wishlistItems.find(item => item.book_id === body.book_id && item.user_id === req.user.id);
        if (exists) {
            return {
                success: false,
                message: 'Book already in wishlist!'
            };
        }
        const wishlistItem = {
            id: Date.now().toString(),
            user_id: req.user.id,
            book_id: body.book_id,
            book_title: body.book_title || 'Unknown Title',
            book_author: body.book_author || 'Unknown Author',
            book_price: body.book_price || 0,
            book_image: body.book_image || '',
            book_description: body.book_description || '',
            created_at: new Date().toISOString()
        };
        this.wishlistItems.push(wishlistItem);
        console.log('✅ Wishlist item added. Total items:', this.wishlistItems.length);
        return {
            success: true,
            message: 'Book added to wishlist successfully!',
            data: wishlistItem
        };
    }
    removeFromWishlist(req, body) {
        console.log('🗑️ REMOVE FROM WISHLIST:', body);
        console.log('👤 User ID:', req.user.id);
        const initialLength = this.wishlistItems.length;
        this.wishlistItems = this.wishlistItems.filter(item => !(item.book_id === body.book_id && item.user_id === req.user.id));
        const removed = initialLength > this.wishlistItems.length;
        if (removed) {
            console.log('✅ Wishlist item removed. Total items:', this.wishlistItems.length);
            return {
                success: true,
                message: 'Book removed from wishlist successfully!',
                removed: true
            };
        }
        else {
            return {
                success: false,
                message: 'Book not found in wishlist',
                removed: false
            };
        }
    }
    getWishlist(req) {
        console.log('📋 GET WISHLIST CALLED for user:', req.user.id);
        const userWishlist = this.wishlistItems.filter(item => item.user_id === req.user.id);
        console.log('✅ Returning wishlist items:', userWishlist.length);
        return userWishlist;
    }
    checkInWishlist(req, bookId) {
        console.log('🔍 CHECK WISHLIST FOR:', bookId);
        console.log('👤 User ID:', req.user.id);
        const inWishlist = this.wishlistItems.some(item => item.book_id === bookId && item.user_id === req.user.id);
        console.log('✅ Check result:', inWishlist);
        return {
            success: true,
            inWishlist,
            bookId
        };
    }
    test() {
        return {
            success: true,
            message: '🎉 Wishlist controller is working!',
            totalItems: this.wishlistItems.length,
            timestamp: new Date().toISOString()
        };
    }
    debug() {
        return {
            success: true,
            totalItems: this.wishlistItems.length,
            items: this.wishlistItems,
            timestamp: new Date().toISOString()
        };
    }
    clearWishlist(req) {
        const initialLength = this.wishlistItems.length;
        this.wishlistItems = this.wishlistItems.filter(item => item.user_id !== req.user.id);
        const removedCount = initialLength - this.wishlistItems.length;
        return {
            success: true,
            message: `Cleared ${removedCount} items from wishlist`,
            removedCount
        };
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add book to wishlist' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remove book from wishlist' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "removeFromWishlist", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user wishlist' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Get)('check/:bookId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Check if book is in wishlist' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "checkInWishlist", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test wishlist endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('debug'),
    (0, swagger_1.ApiOperation)({ summary: 'Debug - show all wishlist items' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "debug", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Clear user wishlist' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "clearWishlist", null);
exports.WishlistController = WishlistController = __decorate([
    (0, swagger_1.ApiTags)('wishlist'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('wishlist')
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map