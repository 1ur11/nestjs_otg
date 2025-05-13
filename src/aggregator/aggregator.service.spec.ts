import { Test, TestingModule } from '@nestjs/testing';
import { AggregatorService } from './aggregator.service';
import { getModelToken } from '@nestjs/mongoose';
import { AgrTransaction } from './schemas/agr-transaction.schema';
import { TransactionType } from '../enums/transaction-type.enum';

describe('AggregatorService', () => {
  let service: AggregatorService;
  let model: { aggregate: jest.Mock };

  beforeEach(async () => {
    model = {
      aggregate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AggregatorService,
        {
          provide: getModelToken(AgrTransaction.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<AggregatorService>(AggregatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAggregatedDataByUserId', () => {
    it('should return aggregated data for user', async () => {
      model.aggregate.mockResolvedValue([
        { _id: TransactionType.EARNED, totalAmount: 100 },
        { _id: TransactionType.SPENT, totalAmount: 30 },
        { _id: TransactionType.PAYOUT, totalAmount: 20 },
      ]);

      const result = await service.getAggregatedDataByUserId('00001');

      expect(result).toEqual({
        balance: 50,
        earned: 100,
        spent: 30,
        payout: 20,
        paidOut: 20,
      });

      expect(model.aggregate).toHaveBeenCalledWith([
        { $match: { userId: '00001' } },
        {
          $group: {
            _id: '$type',
            totalAmount: { $sum: { $toDecimal: '$amount' } },
          },
        },
      ]);
    });
  });

  describe('getRequestedPayouts', () => {
    it('should return grouped payout data by user', async () => {
      const mockResponse = [
        { userId: '00001', payoutAmount: '100.50' },
        { userId: '00002', payoutAmount: '200.00' },
      ];

      model.aggregate.mockResolvedValue(mockResponse);

      const result = await service.getRequestedPayouts();

      expect(result).toEqual(mockResponse);
      expect(model.aggregate).toHaveBeenCalledWith([
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
    });
  });
});
