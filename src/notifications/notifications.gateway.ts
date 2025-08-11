import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    pingInterval: 25000,
    pingTimeout: 60000,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      console.log('Connection rejected: no userId');
      client.disconnect();
      return;
    }

    for (const [socketId, id] of this.connectedClients) {
      if (id === userId) {
        this.connectedClients.delete(socketId);
        this.server.sockets.sockets.get(socketId)?.disconnect(true);
      }
    }

    this.connectedClients.set(client.id, userId);
    console.log(
      `User connected: ${userId}. Total: ${this.connectedClients.size}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(
      `User disconnected: ${client.id}. Total: ${this.connectedClients.size}`,
    );
  }

  sendOrderNotificationToVendor(vendorId: string, payload: any) {
    for (const [socketId, userId] of this.connectedClients.entries()) {
      if (userId === vendorId) {
        this.server.to(socketId).emit('orderNotification', payload);
      }
    }
  }

  sendRiderApprovalNotification(riderId: string, payload: any) {
    for (const [socketId, userId] of this.connectedClients.entries()) {
      if (userId === riderId) {
        this.server.to(socketId).emit('riderAcceptNotification', payload);
      }
    }
  }

  orderStatusUpdate(vendorId: string, payload: any) {
    for (const [socketId, userId] of this.connectedClients.entries()) {
      if (userId === vendorId) {
        this.server.to(socketId).emit('orderStatusUpdate', payload);
      }
    }
  }
}
