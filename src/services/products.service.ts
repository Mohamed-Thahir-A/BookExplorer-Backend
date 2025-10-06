import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    console.log('✅ ProductsService initialized with Supabase');
  }

  async findAll() {
    const { data, error } = await this.supabase.from('product').select('*, category(*)');
    if (error) this.logger.error(error.message);
    return data || [];
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('product')
      .select('*, category(*)')
      .eq('id', id)
      .single();
    if (error) this.logger.error(error.message);
    return data || null;
  }

  async create(product: any) {
    const { data, error } = await this.supabase
      .from('product')
      .insert([{ ...product, last_scraped_at: new Date() }])
      .select()
      .single();
    if (error) this.logger.error(error.message);
    return data || null;
  }

  async update(id: string, updateData: any) {
    const { data, error } = await this.supabase
      .from('product')
      .update({ ...updateData, last_scraped_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) this.logger.error(error.message);
    return data || null;
  }

  async delete(id: string) {
    const { error } = await this.supabase.from('product').delete().eq('id', id);
    if (error) {
      this.logger.error(error.message);
      return false;
    }
    return true;
  }
}
