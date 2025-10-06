import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Book } from '../entities/book.entity'; 
import { AddToWishlistDto, RemoveFromWishlistDto } from '../dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Book) 
    private bookRepository: Repository<Book>,
  ) {}

  async addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto): Promise<{ message: string }> {
    const { book_id } = addToWishlistDto;

    const book = await this.bookRepository.findOne({ where: { id: book_id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const existing = await this.wishlistRepository.findOne({
      where: { 
        userId: userId, 
        bookId: book_id 
      }
    });

    if (existing) {
      throw new ConflictException('Book already in wishlist');
    }

    const wishlistItem = this.wishlistRepository.create({
      userId: userId,
      bookId: book_id
    });

    await this.wishlistRepository.save(wishlistItem);

    return { message: 'Book added to wishlist successfully' };
  }

  async removeFromWishlist(userId: string, removeFromWishlistDto: RemoveFromWishlistDto): Promise<{ message: string }> {
    const { book_id } = removeFromWishlistDto;

    const result = await this.wishlistRepository.delete({
      userId: userId,
      bookId: book_id
    });

    if (result.affected === 0) {
      throw new NotFoundException('Book not found in wishlist');
    }

    return { message: 'Book removed from wishlist successfully' };
  }

  async getUserWishlist(userId: string): Promise<any[]> {
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

  async checkInWishlist(userId: string, bookId: string): Promise<{ inWishlist: boolean }> {
    const item = await this.wishlistRepository.findOne({
      where: { 
        userId: userId, 
        bookId: bookId 
      }
    });
    return { inWishlist: !!item };
  }
}