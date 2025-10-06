import { Injectable, NotFoundException ,Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductDetail } from '../entities/product-detail.entity';


interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  category?: string;
  author?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    
  
  ) {
    console.log('ProductsService initialized');
  }

  async findWithFilters(filters: ProductFilters): Promise<{ 
    products: Product[]; 
    total: number; 
    page: number;
    totalPages: number;
  }> {
    const {
      search,
      minPrice,
      maxPrice,
      minRating,
      category,
      author,
      page = 1,
      limit = 300, 
    } = filters;

    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');
    
    if (search) {
      query.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search OR product.author ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      
      query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice !== undefined) {
      
      query.andWhere('product.price >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
     
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    
    if (minRating !== undefined) {
      query.andWhere('product.rating >= :minRating', { minRating });
    }

    if (category) {
      query.andWhere('category.slug = :category', { category });
    }

    if (author) {
      query.andWhere('product.author ILIKE :author', { author: `%${author}%` });
    }

    
    const [products, total] = await query
      .take(limit)
      .orderBy('product.last_scraped_at', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    
    return {
      products,
      total,
      page,
      totalPages,
    };
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category'],
      order: { last_scraped_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['category', 'detail', 'reviews']
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }


async addScrapedProducts(products: Partial<Product>[]): Promise<Product[]> {
  const savedProducts: Product[] = [];
  
  for (const productData of products) {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: [
          { source_id: productData.source_id },
          { 
            title: productData.title,
            author: productData.author,
            price: productData.price
          }
        ]
      });
      
      if (existingProduct) {
        await this.productRepository.update(existingProduct.id, {
          ...productData,
          last_scraped_at: new Date()
        });
        const updatedProduct = await this.productRepository.findOne({
          where: { id: existingProduct.id },
          relations: ['category']
        });
        if (updatedProduct) savedProducts.push(updatedProduct);
      } else {
        const newProduct = this.productRepository.create(productData);
        const saved = await this.productRepository.save(newProduct);
        savedProducts.push(saved);
      }
    } catch (error) {
      this.logger.error(`Error saving scraped product: ${error.message}`);
    }
  }
  
  return savedProducts;
}


  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return await this.productRepository.save(newProduct);
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    averagePrice: number;
    averageRating: number;
    topAuthors: Array<{ author: string; count: number }>;
  }> {
    const totalProducts = await this.productRepository.count();
    
    const avgPriceResult = await this.productRepository
      .createQueryBuilder('product')
      .select('AVG(product.price)', 'avg')
      .getRawOne();
    
    const avgRatingResult = await this.productRepository
      .createQueryBuilder('product')
      .select('AVG(product.rating)', 'avg')
      .getRawOne();
    
    const topAuthors = await this.productRepository
      .createQueryBuilder('product')
      .select('product.author', 'author')
      .addSelect('COUNT(*)', 'count')
      .where('product.author IS NOT NULL')
      .groupBy('product.author')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();
    
    return {
      totalProducts,
      averagePrice: parseFloat(avgPriceResult?.avg) || 0,
      averageRating: parseFloat(avgRatingResult?.avg) || 0,
      topAuthors: topAuthors.map(item => ({
        author: item.author,
        count: parseInt(item.count)
      })),
    };
  }

  async findByCategorySlug(categorySlug: string, page: number = 1, limit: number = 12): Promise<{ 
    products: Product[]; 
    total: number; 
    page: number;
    totalPages: number;
    category: any;
  }> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('category.slug = :categorySlug', { categorySlug });

    const skip = (page - 1) * limit;
    
    const [products, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('product.last_scraped_at', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    
    const category = products.length > 0 ? products[0].category : null;

    return {
      products,
      total,
      page,
      totalPages,
      category,
    };
  }

  async getProductsWithCategories(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('category.title', 'ASC')
      .addOrderBy('product.last_scraped_at', 'DESC')
      .getMany();
  }

  async searchProducts(searchTerm: string, page: number = 1, limit: number = 12): Promise<{ 
    products: Product[]; 
    total: number; 
    page: number;
    totalPages: number;
  }> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.title ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('product.author ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('product.description ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('category.title ILIKE :search', { search: `%${searchTerm}%` });

    const skip = (page - 1) * limit;
    
    const [products, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('product.last_scraped_at', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    
    return {
      products,
      total,
      page,
      totalPages,
    };
  }

  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category'],
      where: {
        rating: MoreThanOrEqual(4) 
      },
      order: { 
        rating: 'DESC',
        review_count: 'DESC'
      },
      take: limit,
    });
  }

  async getRecentProducts(limit: number = 8): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category'],
      order: { 
        last_scraped_at: 'DESC'
      },
      take: limit,
    });
  }

  async updateProductRating(productId: string, rating: number, reviewCount: number): Promise<Product> {
    const product = await this.findOne(productId);
    product.rating = rating;
    product.review_count = reviewCount;
    return await this.productRepository.save(product);
  }

  async getProductsByPriceRange(minPrice: number, maxPrice: number, page: number = 1, limit: number = 12): Promise<{ 
    products: Product[]; 
    total: number; 
    page: number;
    totalPages: number;
  }> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice
      });

    const skip = (page - 1) * limit;
    
    const [products, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('product.price', 'ASC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    
    return {
      products,
      total,
      page,
      totalPages,
    };
  }

  async getProductsByAuthor(author: string, page: number = 1, limit: number = 12): Promise<{ 
    products: Product[]; 
    total: number; 
    page: number;
    totalPages: number;
  }> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.author ILIKE :author', { author: `%${author}%` });

    const skip = (page - 1) * limit;
    
    const [products, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('product.last_scraped_at', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    
    return {
      products,
      total,
      page,
      totalPages,
    };
  }

  async getUniqueAuthors(): Promise<string[]> {
    const authors = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.author', 'author')
      .where('product.author IS NOT NULL')
      .andWhere('product.author != :empty', { empty: '' })
      .orderBy('author', 'ASC')
      .getRawMany();

    return authors.map(item => item.author).filter(author => author && author.trim() !== '');
  }

  async getPriceRanges(): Promise<{ min: number; max: number }> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.price)', 'min')
      .addSelect('MAX(product.price)', 'max')
      .getRawOne();

    return {
      min: parseFloat(result.min) || 0,
      max: parseFloat(result.max) || 100
    };
  }

  async getProductsGroupedByCategory(): Promise<{ [category: string]: Product[] }> {
    const products = await this.getProductsWithCategories();
    
    const groupedProducts: { [category: string]: Product[] } = {};
    
    products.forEach(product => {
      const categoryName = product.category?.title || 'Uncategorized';
      if (!groupedProducts[categoryName]) {
        groupedProducts[categoryName] = [];
      }
      groupedProducts[categoryName].push(product);
    });
    
    return groupedProducts;
  }

  async getProductsWithSorting(
    sortBy: string = 'newest', 
    page: number = 1, 
    limit: number = 12
  ): Promise<{ 
    products: Product[]; 
    total: number; 
    page: number;
    totalPages: number;
  }> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    switch (sortBy) {
      case 'price-low':
        query.orderBy('product.price', 'ASC');
        break;
      case 'price-high':
        query.orderBy('product.price', 'DESC');
        break;
      case 'rating':
        query.orderBy('product.rating', 'DESC');
        break;
      case 'title':
        query.orderBy('product.title', 'ASC');
        break;
      case 'author':
        query.orderBy('product.author', 'ASC');
        break;
      case 'category':
        query.orderBy('category.title', 'ASC');
        break;
      default: 
        query.orderBy('product.last_scraped_at', 'DESC');
        break;
    }

    const skip = (page - 1) * limit;
    
    const [products, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    
    return {
      products,
      total,
      page,
      totalPages,
    };
  }
}

