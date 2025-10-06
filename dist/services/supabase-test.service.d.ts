import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
export declare class SupabaseTestService {
    private productRepository;
    private categoryRepository;
    private userRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, userRepository: Repository<User>);
    testConnection(): Promise<{
        success: boolean;
        message: string;
        counts: {
            products: number;
            categories: number;
            users: number;
        };
        database: string;
        nextStep: string;
        error?: undefined;
        suggestion?: undefined;
    } | {
        success: boolean;
        error: any;
        suggestion: string;
        message?: undefined;
        counts?: undefined;
        database?: undefined;
        nextStep?: undefined;
    }>;
}
