import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TransactionType } from '../../enums/transaction-type.enum';

@Schema({ timestamps: true })
export class AgrTransaction extends Document {
  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  amount: MongooseSchema.Types.Decimal128;
}

export const AgrTransactionSchema =
  SchemaFactory.createForClass(AgrTransaction);
