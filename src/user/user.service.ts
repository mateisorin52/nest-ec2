import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/userDto';
const bcrypt = require('bcrypt');
@Injectable()
export class UserService {
  saltRounds = 10;
  constructor(private readonly prismaService: PrismaService) {}
  async getUsers(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      include: { friends: true, bank_account: true },
    });
    return users;
  }
  async getSingleUser(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { id },

      include: { friends: true, bank_account: true },
    });
  }
  async createUser(user: UserDto): Promise<any> {
    const userExists = await this.prismaService.user.findFirst({
      where: { email: user.email },
    });
    if (userExists) return { success: false, message: 'Email already exists!' };
    if (user.password.length < 5)
      return { success: false, message: 'Password too weak' };

    const hashedPass = await bcrypt
      .genSalt(this.saltRounds)
      .then((salt) => bcrypt.hash(user.password, salt));
    return await this.prismaService.user.create({
      include: { bank_account: true },
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password_hash: hashedPass,
        bank_account: {
          create: {
            amount: user.bank_account.amount,
            currency: user.bank_account.currency,
          },
        },
      },
    });
  }
  async sendMoneyToRecipient(
    senderBankAccountId: string,
    recipientBankAccountId: string,
    amount: number,
  ) {
    if (!senderBankAccountId || !recipientBankAccountId || !amount) {
      return { success: false, message: 'Fields were not filled properly.' };
    }
    const senderBankAccount = await this.prismaService.bankAccount.findUnique({
      where: { id: senderBankAccountId },
    });
    const recipientBankAccount =
      await this.prismaService.bankAccount.findUnique({
        where: { id: recipientBankAccountId },
      });
    if (!senderBankAccount || !recipientBankAccount)
      return {
        success: false,
        message: 'Sender or recipient bank account does not exist.',
      };
    if (senderBankAccount.amount < amount)
      return {
        success: false,
        message: "You don't have enough money to send.",
      };
    if (senderBankAccount.currency !== recipientBankAccount.currency)
      return {
        success: false,
        message: `You can't send ${senderBankAccount.currency} to ${recipientBankAccount.currency}.`,
      };
    recipientBankAccount.amount = recipientBankAccount.amount + amount;
    senderBankAccount.amount = senderBankAccount.amount - amount;
    const transaction1 = await this.prismaService.bankAccount.update({
      data: { amount: recipientBankAccount.amount },
      where: { id: recipientBankAccount.id },
    });
    const transaction2 = await this.prismaService.bankAccount.update({
      data: { amount: senderBankAccount.amount },
      where: { id: senderBankAccount.id },
    });
    if (transaction1 && transaction2) {
      return {
        success: true,
        message: 'Transaction successful!',
        data: [transaction1, transaction2],
      };
    }
  }
}
