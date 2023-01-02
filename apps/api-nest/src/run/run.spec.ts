import { Test, TestingModule } from '@nestjs/testing';
import { Api } from './run';

describe('Api', () => {
  let provider: Api;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Api],
    }).compile();

    provider = module.get<Api>(Api);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
