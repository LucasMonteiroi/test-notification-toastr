import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventGateway.name);

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Message: ', data);
    this.server.emit(
      'events',
      `Message get from messages: ${JSON.stringify(data)}`,
    );
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.warn(`Client connected: ${client.id}`);
    // console.log('Client connected: ', client);
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
    // console.log('Client disconnected: ', client);
  }

  emitToEvents(data: string) {
    this.server.emit('events', data);
  }
}
