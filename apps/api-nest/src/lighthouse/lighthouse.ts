import { Process } from '@nestjs/bull';
import { Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('lighthouse')
export class Lighthouse {
  @Process('lighthouse')
  async run(job: Job<unknown>) {
    console.log(job);
    return {
      ok: true,
    };
  }
}
