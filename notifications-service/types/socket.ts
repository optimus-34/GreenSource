import { Socket } from "socket.io";
import { INotification } from "./notification";

export interface ISocketUser {
  userId: string;
  socketId: string;
}

export interface ServerToClientEvents {
  notification: (notification: INotification) => void;
  "notifications:read": (notificationId: string) => void;
  "notifications:count": (count: number) => void;
}

export interface ClientToServerEvents {
  subscribe: (userId: string) => void;
  unsubscribe: (userId: string) => void;
}

export type NotificationSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents
>;
