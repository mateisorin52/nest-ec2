import { IsNotEmpty } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  senderBankAccountId: string;
  @IsNotEmpty()
  recipientBankAccountId: string;
}
