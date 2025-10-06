import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseTestService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  async testConnection() {
    try {
      const { data: products, error: pError } = await this.supabase.from('product').select('*');
      const { data: categories, error: cError } = await this.supabase.from('category').select('*');
      const { data: users, error: uError } = await this.supabase.from('user').select('*');

      if (pError || cError || uError) throw new Error(pError?.message || cError?.message || uError?.message);

      return {
        success: true,
        counts: {
          products: products.length,
          categories: categories.length,
          users: users.length,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
