import { Test, TestingModule } from '@nestjs/testing';
import { Browser } from './browser';

describe('Browser', () => {
  let provider: Browser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Browser],
    }).compile();

    provider = module.get<Browser>(Browser);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
