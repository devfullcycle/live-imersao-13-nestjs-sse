import {
  Controller,
  Get,
  MessageEvent,
  Param,
  ParseIntPipe,
  Post,
  Render,
  Res,
  Sse,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Observable, of } from 'rxjs';
import { Report, Status } from '@prisma/client';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('view')
  @Render('reports')
  async view() {
    const reports = await this.reportsService.all();
    return { reports };
  }

  @Get()
  all() {
    return this.reportsService.all();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.reportsService.findOne(id);
  }

  @Post()
  request() {
    return this.reportsService.request();
  }

  @Sse(':id/events')
  async events(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() response: Response,
  ): Promise<Observable<MessageEvent>> {
    const report = await this.reportsService.findOne(id);

    if (
      !report ||
      report.status === Status.DONE ||
      report.status === Status.ERROR
    ) {
      response.status(404);
      response.end();
      return of();
    }

    const eventObservable = new Observable<MessageEvent>((observer) => {
      const eventListener = (report: Report) => {
        if (
          report.id === id &&
          (report.status === Status.DONE || report.status === Status.ERROR)
        ) {
          observer.next({
            type: 'message',
            data: report,
          });
          observer.complete();
        } else {
          observer.next();
        }
      };

      // Add the event listener to the event emitter
      this.eventEmitter.on('report.finished', eventListener);

      // Clean up the event listener when the observable is unsubscribed
      return () => {
        this.eventEmitter.off('report.finished', eventListener);
      };
    });

    return eventObservable;
  }
}
