import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwt: JwtService) {}

  async loginUser(user: { email: string; password: string }): Promise<any> {
    const userExists = await this.prismaService.user.findFirst({
      include: { bank_account: true, friends: true },
      where: { email: user.email },
    });
    if (!userExists) return { success: false, message: 'User does not exist' };
    const passMatch = await bcrypt.compare(
      user.password,
      userExists.password_hash,
    );
    if (!passMatch) return { success: false, message: 'Password is incorrect' };
    return this.signToken(userExists.id, user.email);
  }

  async signToken(userId: string, email: string): Promise<{ token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    return {
      token: await this.jwt.signAsync(payload, {
        secret: 'secret',
        expiresIn: '15m',
      }),
    };
  }
}
