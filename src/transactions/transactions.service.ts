import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import {
  FindOptionsWhere,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async findAll(dto: GetTransactionsDto): Promise<TransactionResponseDto> {
    const { startDate, endDate, type, page = 1, limit = 10 } = dto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Transaction> = {};

    if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    }

    if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
    }

    if (type) {
      where.type = type;
    }

    const [items, totalItems] = await this.transactionRepo.findAndCount({
      where,
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
}
