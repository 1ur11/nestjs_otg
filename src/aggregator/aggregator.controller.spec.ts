import { Test, TestingModule } from '@nestjs/testing';
import { AggregatorController } from './aggregator.controller';
import { AggregatorService } from './aggregator.service';
import { getModelToken } from '@nestjs/mongoose';
import { AgrTransaction } from './schemas/agr-transaction.schema';

const mockAgrTransactionModel = {};

describe('AggregatorController', () => {
  let controller: AggregatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AggregatorController],
      providers: [
        AggregatorService,
        {
          provide: getModelToken(AgrTransaction.name),
          useValue: mockAgrTransactionModel,
        },
      ],
    }).compile();

    controller = module.get<AggregatorController>(AggregatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
