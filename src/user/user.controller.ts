import { Controller, Get, Param, Req } from '@nestjs/common';
import { Body, Post, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserDto } from './dto/userDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }
  @UseGuards(JwtGuard)
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
}
