import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewHistoryController } from '../controllers/view-history.controller';
import { ViewHistoryService } from '../services/view-history.service';
import { ViewHistory } from '../entities/view-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViewHistory])],
  controllers: [ViewHistoryController],
  providers: [ViewHistoryService],
  exports: [ViewHistoryService],
})
export class ViewHistoryModule {}