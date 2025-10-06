import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseTestService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  async testConnection() {
    try {
      console.log('🧪 Testing Supabase database connection...');
      
      const { data: products, error: productError } = await this.supabase.from('product').select('*');
      if (productError) throw productError;
      
      const { data: categories, error: categoryError } = await this.supabase.from('category').select('*');
      if (categoryError) throw categoryError;
      
      const { data: users, error: userError } = await this.supabase.from('user').select('*');
      if (userError) throw userError;

      return {
        success: true,
        message: '✅ Connected to Supabase successfully! All tables are accessible.',
        counts: {
          products: products.length,
          categories: categories.length,
          users: users.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        suggestion: 'Check table names, RLS policies, and service key in environment variables.',
      };
    }
  }
}
