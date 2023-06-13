import { Test, TestingModule } from '@nestjs/testing';
import { ReportsJobService } from './reports-job.service';

describe('ReportsJobService', () => {
  let service: ReportsJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsJobService],
    }).compile();

    service = module.get<ReportsJobService>(ReportsJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
