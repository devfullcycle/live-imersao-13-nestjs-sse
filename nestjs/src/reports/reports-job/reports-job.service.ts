import { Process, Processor } from '@nestjs/bull';
import { ReportsService } from '../reports/reports.service';
import { Job } from 'bull';

@Processor('reports')
export class ReportsJobService {
  constructor(private reportsService: ReportsService) {}

  @Process()
  async produce(job: Job<{ reportId: number }>) {
    console.log('Producing report');
    await this.reportsService.produce(job.data.reportId);
    return {};
  }
}
