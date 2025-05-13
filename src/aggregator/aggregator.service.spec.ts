import { Test, TestingModule } from '@nestjs/testing';
import { AggregatorService } from './aggregator.service';
import { getModelToken } from '@nestjs/mongoose';
import { AgrTransaction } from './schemas/agr-transaction.schema';

const mockAgrTransactionModel = {};

describe('AggregatorService', () => {
  let service: AggregatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AggregatorService,
        {
          provide: getModelToken(AgrTransaction.name),
          useValue: mockAgrTransactionModel,
        },
      ],
    }).compile();

    service = module.get<AggregatorService>(AggregatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
