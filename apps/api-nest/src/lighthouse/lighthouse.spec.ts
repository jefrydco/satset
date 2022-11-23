import { Test, TestingModule } from '@nestjs/testing';
import { Lighthouse } from './lighthouse';

describe('Lighthouse', () => {
  let provider: Lighthouse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Lighthouse],
    }).compile();

    provider = module.get<Lighthouse>(Lighthouse);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
