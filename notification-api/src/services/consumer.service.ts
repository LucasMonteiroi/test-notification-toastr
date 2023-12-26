import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfirmChannel } from 'amqplib';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { EventGateway } from 'src/event/event.gateway';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);

  private readonly QUEUE_NAME = 'TEST_QUEUE';

  constructor(private eventGateway: EventGateway) {
    const connection = amqp.connect(['amqp://user:password@localhost:5672']);
    this.channelWrapper = connection.createChannel();
  }

  async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.QUEUE_NAME, { durable: true });
        await channel.consume(this.QUEUE_NAME, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.eventGateway.emitToEvents(JSON.stringify(content));
            channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
