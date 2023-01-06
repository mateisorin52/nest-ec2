import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDto } from 'src/user/dto/userDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  async loginUser(
    @Body() user: { email: string; password: string },
  ): Promise<User> {
    return this.authService.loginUser(user);
  }
}
