import { Controller, Post, Delete, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('wishlist')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  
 
  private wishlistItems: any[] = [];

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add book to wishlist' })
  addToWishlist(@Request() req, @Body() body: any) {
    console.log('🎯 ADD TO WISHLIST CALLED:', body);
    console.log('👤 User ID:', req.user.id);
    
   
    const exists = this.wishlistItems.find(item => 
      item.book_id === body.book_id && item.user_id === req.user.id
    );
    
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

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove book from wishlist' })
  removeFromWishlist(@Request() req, @Body() body: any) {
    console.log('🗑️ REMOVE FROM WISHLIST:', body);
    console.log('👤 User ID:', req.user.id);
    
    const initialLength = this.wishlistItems.length;
    this.wishlistItems = this.wishlistItems.filter(item => 
      !(item.book_id === body.book_id && item.user_id === req.user.id)
    );
    
    const removed = initialLength > this.wishlistItems.length;
    
    if (removed) {
      console.log('✅ Wishlist item removed. Total items:', this.wishlistItems.length);
      return { 
        success: true,
        message: 'Book removed from wishlist successfully!',
        removed: true
      };
    } else {
      return { 
        success: false,
        message: 'Book not found in wishlist',
        removed: false
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user wishlist' })
  getWishlist(@Request() req) {
    console.log('📋 GET WISHLIST CALLED for user:', req.user.id);
    
    const userWishlist = this.wishlistItems.filter(item => item.user_id === req.user.id);
    
    console.log('✅ Returning wishlist items:', userWishlist.length);
    
    return userWishlist; 
  }

  @Get('check/:bookId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if book is in wishlist' })
  checkInWishlist(@Request() req, @Param('bookId') bookId: string) {
    console.log('🔍 CHECK WISHLIST FOR:', bookId);
    console.log('👤 User ID:', req.user.id);
    
    const inWishlist = this.wishlistItems.some(item => 
      item.book_id === bookId && item.user_id === req.user.id
    );
    
    console.log('✅ Check result:', inWishlist);
    
    return { 
      success: true,
      inWishlist,
      bookId 
    };
  }

  
  @Get('test')
  @ApiOperation({ summary: 'Test wishlist endpoint' })
  test() {
    return { 
      success: true,
      message: '🎉 Wishlist controller is working!',
      totalItems: this.wishlistItems.length,
      timestamp: new Date().toISOString()
    };
  }

  
  @Get('debug')
  @ApiOperation({ summary: 'Debug - show all wishlist items' })
  debug() {
    return {
      success: true,
      totalItems: this.wishlistItems.length,
      items: this.wishlistItems,
      timestamp: new Date().toISOString()
    };
  }

  
  @Delete('clear')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Clear user wishlist' })
  clearWishlist(@Request() req) {
    const initialLength = this.wishlistItems.length;
    this.wishlistItems = this.wishlistItems.filter(item => item.user_id !== req.user.id);
    
    const removedCount = initialLength - this.wishlistItems.length;
    
    return {
      success: true,
      message: `Cleared ${removedCount} items from wishlist`,
      removedCount
    };
  }
}