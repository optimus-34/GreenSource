export enum NotificationType {
  ORDER = "order",
  PAYMENT = "payment",
  PRODUCT = "product",
  SYSTEM = "system",
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export interface INotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  preferences: {
    [key in NotificationType]?: {
      email: boolean;
      push: boolean;
    };
  };
}
