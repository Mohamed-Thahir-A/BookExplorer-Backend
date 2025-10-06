import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from '../entities/product.entity'
import { Category } from '../entities/category.entity'
import { User } from '../entities/user.entity'

@Injectable()
export class SupabaseTestService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async testConnection() {
    try {
      console.log('🧪 Testing PostgreSQL database connection with entities...')
      
      
      const productCount = await this.productRepository.count()
      const categoryCount = await this.categoryRepository.count()
      const userCount = await this.userRepository.count()
      
      return { 
        success: true, 
        message: '✅ Connected to Supabase PostgreSQL successfully! All entities are working.',
        counts: {
          products: productCount,
          categories: categoryCount,
          users: userCount
        },
        database: 'Supabase PostgreSQL',
        nextStep: 'Your backend is now fully connected to Supabase!'
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        suggestion: 'Check if your entities match the database schema'
      }
    }
  }
}