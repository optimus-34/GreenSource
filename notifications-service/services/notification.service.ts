import { v4 as uuidv4 } from "uuid";
import { Notification } from "../models/notification.model";
import { NotificationPreferences } from "../models/notification-preferences.model";
import { INotification, INotificationPreferences } from "../types/notification";
import { SocketService } from "./socket.service";

export class NotificationService {
  private socketService: SocketService;

  constructor() {
    this.socketService = SocketService.getInstance();
  }
  async getNotifications(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<{
    notifications: INotification[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ userId }),
    ]);

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPreferences(
    userId: string
  ): Promise<INotificationPreferences | null> {
    return await NotificationPreferences.findOne({ userId });
  }

  async updatePreferences(
    userId: string,
    preferencesData: Partial<INotificationPreferences>
  ): Promise<INotificationPreferences> {
    const preferences = await NotificationPreferences.findOneAndUpdate(
      { userId },
      { ...preferencesData },
      { new: true, upsert: true }
    );
    return preferences;
  }

  async createNotification(
    notificationData: Omit<INotification, "id" | "isRead" | "createdAt">
  ): Promise<INotification> {
    const preferences = await this.getPreferences(notificationData.userId);

    if (preferences) {
      const typePreferences = preferences.preferences[notificationData.type];
      if (typePreferences && !typePreferences.email && !typePreferences.push) {
        throw new Error("User has disabled this type of notifications");
      }
    }

    const notification = new Notification({
      ...notificationData,
      id: uuidv4(),
      isRead: false,
    });

    const savedNotification = await notification.save();

    // Emit real-time notification
    this.socketService.emitToUser(
      notificationData.userId,
      "notification",
      savedNotification
    );

    return savedNotification;
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotification | null> {
    const notification = await Notification.findOneAndUpdate(
      { id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (notification) {
      // Emit read status update
      this.socketService.emitToUser(
        userId,
        "notifications:read",
        notificationId
      );

      // Update unread count
      const unreadCount = await Notification.countDocuments({
        userId,
        isRead: false,
      });
      this.socketService.emitToUser(userId, "notifications:count", unreadCount);
    }

    return notification;
  }
}
