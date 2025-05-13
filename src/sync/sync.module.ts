import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { AggregatorModule } from '../aggregator/aggregator.module';

@Module({
  imports: [AggregatorModule],
  providers: [SyncService],
})
export class SyncModule {}
