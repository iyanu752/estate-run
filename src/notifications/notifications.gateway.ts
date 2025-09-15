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
    if (userId) {
      this.connectedClients.set(client.id, userId);
      setTimeout(() => this.connectedClients.delete(client.id), 1000 * 60 * 30);
    }
    console.log(`User connected: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    client.removeAllListeners();
    console.log(`User disconnected: ${client.id}`);
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

  sendEstateNewsNotification(userId: string, payload: any) {
    for (const [socketId, connectedUserId] of this.connectedClients.entries()) {
      if (connectedUserId === userId) {
        this.server.to(socketId).emit('estateNewsNotification', payload);
      }
    }
  }
}
