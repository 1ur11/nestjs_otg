import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Transaction } from '../src/transactions/entities/transaction.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionType } from '../src/enums/transaction-type.enum';

const rand = (rand: { min: number; max: number }): number =>
  Math.floor(Math.random() * (rand.max - rand.min + 1)) + rand.min;

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const transactionRepository = app.get<Repository<Transaction>>(
    getRepositoryToken(Transaction),
  );

  const transactions = ['00001', '00002', '00003', '00004', '00005']
    .map((userId) => {
      const transactionsEarned: Transaction[] = Array.from({
        length: 100,
      }).map(() => ({
        userId: userId,
        amount: rand({ min: 10, max: 1000 }),
        type: TransactionType.EARNED,
      }));

      const transactionsSpent: Transaction[] = Array.from({
        length: 100,
      }).map(() => ({
        userId: userId,
        amount: rand({ min: 10, max: 100 }),
        type: TransactionType.SPENT,
      }));

      const transactionsPayout: Transaction[] = Array.from({
        length: 100,
      }).map(() => ({
        userId: userId,
        amount: rand({ min: 1, max: 10 }),
        type: TransactionType.PAYOUT,
      }));

      return [
        ...transactionsEarned,
        ...transactionsSpent,
        ...transactionsPayout,
      ];
    })
    .flat();

  // Insert mock data into the database. Using save() to handle different createdAt values
  for (const transaction of transactions) {
    await transactionRepository.save(transaction);
  }

  console.log('Seed completed! Transactions:', transactions.length);

  await app.close();
}

seed()
  .then(() => console.log('Seeding finished successfully'))
  .catch((error) => console.error('Error during seeding:', error));
