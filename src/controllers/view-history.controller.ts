import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ViewHistoryService } from '../services/view-history.service';

@Controller('view-history')
export class ViewHistoryController {
  constructor(private readonly viewHistoryService: ViewHistoryService) {}

  @Post('track')
  async trackView(
    @Body() trackData: {
      sessionId: string;
      userId?: string;
      path?: string;
      params?: Record<string, any>;
    },
  ) {
    return this.viewHistoryService.trackView(
      trackData.sessionId,
      trackData.userId,
      trackData.path,
      trackData.params,
    );
  }

  @Get('user/:userId')
  async getUserHistory(
    @Param('userId') userId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.viewHistoryService.getUserHistory(userId, limit);
  }

  @Get('session/:sessionId')
  async getSessionHistory(@Param('sessionId') sessionId: string) {
    return this.viewHistoryService.getSessionHistory(sessionId);
  }

  @Get('recent-activity/:userId')
  async getRecentActivity(
    @Param('userId') userId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.viewHistoryService.getRecentActivity(userId, limit);
  }

  @Get('popular-products')
  async getPopularProducts(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.viewHistoryService.getPopularProducts(days, limit);
  }

  @Get('stats')
  async getStatistics() {
    return this.viewHistoryService.getStatistics();
  }

  @Post('cleanup')
  async cleanupOldHistory(@Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number) {
    return this.viewHistoryService.cleanupOldHistory(days);
  }
}