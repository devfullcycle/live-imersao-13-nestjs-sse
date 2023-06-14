import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ReportsModule,
    PrismaModule,
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//Model View Controller
