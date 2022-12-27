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
    console.log(hashedPass);
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
}
