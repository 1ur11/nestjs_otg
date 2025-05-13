/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AggregatorController } from './aggregator.controller';
import { AggregatorService } from './aggregator.service';

describe('AggregatorController', () => {
  let controller: AggregatorController;
  let service: AggregatorService;

  const mockAggregatorService = {
    getRequestedPayouts: jest.fn(),
    getAggregatedDataByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AggregatorController],
      providers: [
        {
          provide: AggregatorService,
          useValue: mockAggregatorService,
        },
      ],
    }).compile();

    controller = module.get<AggregatorController>(AggregatorController);
    service = module.get<AggregatorService>(AggregatorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return payouts from service', async () => {
    const mockPayouts = [{ userId: '00001', payoutAmount: '100.00' }];
    mockAggregatorService.getRequestedPayouts.mockResolvedValue(mockPayouts);

    const result = await controller.getPayouts();

    expect(result).toEqual(mockPayouts);
    expect(service.getRequestedPayouts).toHaveBeenCalled();
  });

  it('should return user aggregation from service', async () => {
    const mockAggregation = {
      balance: 50,
      earned: 100,
      spent: 30,
      payout: 20,
      paidOut: 20,
    };
    mockAggregatorService.getAggregatedDataByUserId.mockResolvedValue(
      mockAggregation,
    );

    const result = await controller.getUserAggregation('00001');

    expect(result).toEqual(mockAggregation);
    expect(service.getAggregatedDataByUserId).toHaveBeenCalledWith('00001');
  });
});
