import { Transaction } from '../entities/transaction.entity';

export class MetaDto {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class TransactionResponseDto {
  items: Transaction[];
  meta: MetaDto;
}
