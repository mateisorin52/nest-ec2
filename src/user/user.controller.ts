import { Controller, Get, Param, Req } from '@nestjs/common';
import { Body, Post, Res, UseGuards } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from '@prisma/client';
import { Response } from 'express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { TransactionDto } from './dto/transactionDto';
import { UserDto } from './dto/userDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //@UseGuards(JwtGuard)
  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }
  //@UseGuards(JwtGuard)
  @Get('/me')
  async getMe(@GetUser('') user: User) {
    return user;
  }
  @Get(':id')
  async getSingleUser(@Param('id') id): Promise<User> {
    return await this.userService.getSingleUser(id);
  }
  @Post('/create')
  async createNewUser(
    @Body()
    user: UserDto,
  ): Promise<User> {
    return await this.userService.createUser(user);
  }
  @Post('/sendMoney')
  async sendMoney(
    @Body()
    transaction: TransactionDto,
    @Res() res: Response,
  ) {
    const responseData = await this.userService.sendMoneyToRecipient(
      transaction.senderBankAccountId,
      transaction.recipientBankAccountId,
      transaction.amount,
    );
    return res
      .status(responseData.success ? HttpStatus.OK : HttpStatus.FORBIDDEN)
      .send(responseData);
  }
}
