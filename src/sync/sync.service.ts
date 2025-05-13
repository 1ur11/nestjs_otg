import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import { AgrTransaction } from '../aggregator/schemas/agr-transaction.schema';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectModel(AgrTransaction.name)
    private agrTransactionModel: Model<AgrTransaction>,
  ) {}

  // Call 4 times in a minute to avoid rate limiting
  @Cron('0,15,30,45 * * * * *')
  async handleCron() {
    this.logger.log('Cron job started: Fetching new transactions');

    try {
      // Retrieve the latest 'createdAt' timestamp from MongoDB
      const latestTransaction = await this.agrTransactionModel
        .findOne()
        .sort({ createdAt: -1 })
        .select('createdAt')
        .lean();

      // Default start date if no transactions exist
      const startDate = latestTransaction
        ? latestTransaction.createdAt.toISOString()
        : '2021-02-01T00:00:00Z';

      this.logger.log(`Fetching transactions from startDate: ${startDate}`);

      // Fetch new transactions from the transactions API
      const apiUrl = `http://localhost:3000/transactions?startDate=${encodeURIComponent(startDate)}&limit=1000`; // TODO move to env

      const response = await axios.get<{
        items: {
          id: string;
          userId: string;
          createdAt: string;
          type: string;
          amount: string;
        }[];
        meta: {
          totalItems: number;
          itemCount: number;
          itemsPerPage: number;
          totalPages: number;
          currentPage: number;
        };
      }>(apiUrl);
      const transactions = response.data.items;

      this.logger.log(`Fetched ${transactions.length} transactions`);

      // Process and store new transactions in MongoDB
      const bulkOps = transactions.map((tx) => ({
        updateOne: {
          filter: { transactionId: tx.id },
          update: {
            $setOnInsert: {
              transactionId: tx.id,
              userId: tx.userId,
              createdAt: new Date(tx.createdAt),
              type: tx.type,
              amount: tx.amount,
            },
          },
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        const result = await this.agrTransactionModel.bulkWrite(bulkOps);
        this.logger.log(`Inserted ${result.upsertedCount} new transactions`);
      } else {
        this.logger.log('No new transactions to insert');
      }
    } catch (error) {
      this.logger.error('Error occurred during cron job execution', error);
    }

    this.logger.log('Cron job completed');
  }
}
