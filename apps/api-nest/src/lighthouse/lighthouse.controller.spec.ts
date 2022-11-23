import { Test, TestingModule } from '@nestjs/testing';
import { LighthouseController } from './lighthouse.controller';

describe('LighthouseController', () => {
  let controller: LighthouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LighthouseController],
    }).compile();

    controller = module.get<LighthouseController>(LighthouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
