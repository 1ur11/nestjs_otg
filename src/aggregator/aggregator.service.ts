import { Injectable } from '@nestjs/common';
import { AgrTransaction } from './schemas/agr-transaction.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionType } from '../enums/transaction-type.enum';

@Injectable()
export class AggregatorService {
  constructor(
    @InjectModel(AgrTransaction.name)
    private agrTransactionModel: Model<AgrTransaction>,
  ) {}

  async getAggregatedDataByUserId(userId: string) {
    const result = await this.agrTransactionModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: { $toDecimal: '$amount' } },
        },
      },
    ]);

    const aggregation = {
      balance: 0,
      earned: 0,
      spent: 0,
      payout: 0,
      paidOut: 0,
    };

    result.forEach((item: { _id: TransactionType; totalAmount: number }) => {
      const amount = parseFloat(item.totalAmount.toString());
      switch (item._id) {
        case TransactionType.EARNED:
          aggregation.earned = amount;
          break;
        case TransactionType.SPENT:
          aggregation.spent = amount;
          break;
        case TransactionType.PAYOUT:
          aggregation.payout = amount;
          break;
      }
    });

    aggregation.paidOut = aggregation.payout;
    aggregation.balance =
      aggregation.earned - aggregation.spent - aggregation.paidOut;

    return aggregation;
  }

  async getRequestedPayouts(): Promise<
    { userId: string; payoutAmount: string }[]
  > {
    const result: { userId: string; payoutAmount: string }[] =
      await this.agrTransactionModel.aggregate([
        { $match: { type: TransactionType.PAYOUT } },
        {
          $group: {
            _id: '$userId',
            totalPayout: { $sum: { $toDecimal: '$amount' } },
          },
        },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            payoutAmount: { $toString: '$totalPayout' },
          },
        },
      ]);

    return result;
  }
}
