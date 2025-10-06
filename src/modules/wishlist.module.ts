import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistService } from '../services/wishlist.service';
import { WishlistController } from '../controllers/wishlist.controller';
import { Wishlist } from '../entities/wishlist.entity';
import { Book } from '../entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Book]), 
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}