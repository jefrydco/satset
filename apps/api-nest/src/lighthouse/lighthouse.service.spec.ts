import { Test, TestingModule } from '@nestjs/testing';
import { LighthouseService } from './lighthouse.service';

describe('LighthouseService', () => {
  let service: LighthouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LighthouseService],
    }).compile();

    service = module.get<LighthouseService>(LighthouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
