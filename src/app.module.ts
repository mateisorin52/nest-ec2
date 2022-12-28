import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TestValService } from './test-val/test-val.service';
import { TestValController } from './test-val/test-val.controller';
@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController, TestValController],
  providers: [AppService, PrismaService, TestValService],
})
export class AppModule {}
