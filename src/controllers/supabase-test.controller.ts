import { Controller, Get } from '@nestjs/common'
import { SupabaseTestService } from '../services/supabase-test.service'

@Controller('supabase-test')
export class SupabaseTestController {
  constructor(private readonly supabaseTestService: SupabaseTestService) {}

  @Get('connection')
  async testConnection() {
    return this.supabaseTestService.testConnection()
  }
}