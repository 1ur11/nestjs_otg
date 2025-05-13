import { Controller, Get, Param } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';

@Controller('aggregator')
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService) {}

  @Get('payouts')
  getPayouts() {
    return this.aggregatorService.getRequestedPayouts();
  }

  @Get(':userId')
  getUserAggregation(@Param('userId') userId: string) {
    return this.aggregatorService.getAggregatedDataByUserId(userId);
  }
}
