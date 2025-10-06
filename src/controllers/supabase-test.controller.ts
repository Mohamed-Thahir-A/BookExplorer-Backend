import { Controller, Get } from '@nestjs/common';
import { SupabaseTestService } from '../services/supabase-test.service';

@Controller('supabase-test')
export class SupabaseTestController {
  constructor(private readonly supabaseService: SupabaseTestService) {}

  @Get()
  async test() {
    return this.supabaseService.testConnection();
  }
}
