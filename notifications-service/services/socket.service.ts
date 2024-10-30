import { Server } from "socket.io";
import {
  NotificationSocket,
  ServerToClientEvents,
  ClientToServerEvents,
} from "../types/socket";
import { INotification } from "../types/notification";

export class SocketService {
  private static instance: SocketService;
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private userSockets: Map<string, Set<string>> = new Map();

  private constructor(io: Server) {
    this.io = io;
    this.setupSocketHandlers();
  }

  static getInstance(io?: Server): SocketService {
    if (!SocketService.instance && io) {
      SocketService.instance = new SocketService(io);
    }
    return SocketService.instance;
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket: NotificationSocket) => {
      console.log("Client connected:", socket.id);

      socket.on("subscribe", (userId: string) => {
        this.addUserSocket(userId, socket.id);
        console.log(`User ${userId} subscribed to notifications`);
      });

      socket.on("unsubscribe", (userId: string) => {
        this.removeUserSocket(userId, socket.id);
        console.log(`User ${userId} unsubscribed from notifications`);
      });

      socket.on("disconnect", () => {
        this.removeSocketFromAllUsers(socket.id);
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  private addUserSocket(userId: string, socketId: string): void {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
  }

  private removeUserSocket(userId: string, socketId: string): void {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  private removeSocketFromAllUsers(socketId: string): void {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(socketId)) {
        this.removeUserSocket(userId, socketId);
      }
    }
  }

  emitToUser(
    userId: string,
    event: keyof ServerToClientEvents,
    ...args: any[]
  ): void {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.io
          .to(socketId)
          .emit(event, ...(args as [INotification] | [string] | [number]));
      });
    }
  }
}
