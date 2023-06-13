import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { Status } from '@prisma/client';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReportsService {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue('reports')
    private reportsQueue: Queue,
    private eventEmitter: EventEmitter2,
  ) {}

  all() {
    return this.prismaService.report.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.report.findUnique({
      where: {
        id,
      },
    });
  }

  async request() {
    const report = await this.prismaService.report.create({
      data: {
        status: Status.PENDING,
      },
    });
    await this.reportsQueue.add({ reportId: report.id });
    return report;
  }

  async produce(reportId: number) {
    console.log('produce method');
    await sleep(Math.random() * 10000);
    await this.prismaService.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: Status.PROCESSING,
      },
    });

    await sleep(Math.random() * 10000);
    const randomStatus = Math.random() > 0.5 ? Status.DONE : Status.ERROR;
    const report = await this.prismaService.report.update({
      where: {
        id: reportId,
      },
      data: {
        filename:
          randomStatus === Status.DONE ? `report-${reportId}.pdf` : null,
        status: randomStatus,
      },
    });
    this.eventEmitter.emit('report.finished', report);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
