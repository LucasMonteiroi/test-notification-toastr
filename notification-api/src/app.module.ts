import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventGateway } from './event/event.gateway';
import { ConsumerService } from './services/consumer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EventGateway, ConsumerService],
})
export class AppModule {}
