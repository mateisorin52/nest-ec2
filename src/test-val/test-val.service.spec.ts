import { Test, TestingModule } from '@nestjs/testing';
import { TestValService } from './test-val.service';

describe('TestValService', () => {
  let service: TestValService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestValService],
    }).compile();

    service = module.get<TestValService>(TestValService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
