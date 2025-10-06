import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  book_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  book_title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  book_author: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  book_description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  book_price?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  book_image?: string;
}

export class RemoveFromWishlistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  book_id: string;
}