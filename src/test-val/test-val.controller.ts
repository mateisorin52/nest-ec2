import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestValService } from './test-val.service';

@Controller('test-val')
export class TestValController {
  constructor(private testValService: TestValService) {}
  @Get('/')
  async getTestVal() {
    return this.testValService.getTestVal();
  }
  @Post('/')
  async getTestValWithId(@Body() data: { id: string }) {
    return this.testValService.getTestValWithId(data.id);
  }
}
