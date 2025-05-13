import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AgrTransaction,
  AgrTransactionSchema,
} from './schemas/agr-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgrTransaction.name, schema: AgrTransactionSchema },
    ]),
  ],
  controllers: [AggregatorController],
  providers: [AggregatorService],
  exports: [MongooseModule], // Exporting MongooseModule if needed in other modules
})
export class AggregatorModule {}
