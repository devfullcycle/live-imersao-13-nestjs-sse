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
import { Observable, defer, map, repeat, tap } from 'rxjs';
import { Status } from '@prisma/client';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

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
  events(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() response: Response,
  ): Observable<MessageEvent> {
    return defer(() => this.reportsService.findOne(id)).pipe(
      repeat({
        delay: 1000,
      }),
      tap((report) => {
        if (report.status === Status.DONE || report.status === Status.ERROR) {
          setTimeout(() => {
            response.end();
          }, 1000);
        }
      }),
      map((report) => ({
        type: 'message',
        data: report,
      })),
    );
  }
}
