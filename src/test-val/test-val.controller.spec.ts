import { Test, TestingModule } from '@nestjs/testing';
import { TestValController } from './test-val.controller';

describe('TestValController', () => {
  let controller: TestValController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestValController],
    }).compile();

    controller = module.get<TestValController>(TestValController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
