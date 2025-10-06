import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    console.log('✅ NavigationService initialized with Supabase');
  }

  async findAll() {
    const { data, error } = await this.supabase.from('navigation').select('*');
    if (error) this.logger.error(error.message);
    return data || [];
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('navigation')
      .select('*')
      .eq('id', id)
      .single();
    if (error) this.logger.error(error.message);
    return data || null;
  }

  async create(nav: { title: string; slug: string; url?: string }) {
    const { data, error } = await this.supabase
      .from('navigation')
      .insert([{ ...nav, last_scraped_at: new Date() }])
      .select()
      .single();
    if (error) this.logger.error(error.message);
    return data || null;
  }

  async update(id: string, updateData: Partial<any>) {
    const { data, error } = await this.supabase
      .from('navigation')
      .update({ ...updateData, last_scraped_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) this.logger.error(error.message);
    return data || null;
  }

  async delete(id: string) {
    const { error } = await this.supabase.from('navigation').delete().eq('id', id);
    if (error) {
      this.logger.error(error.message);
      return false;
    }
    return true;
  }
}
