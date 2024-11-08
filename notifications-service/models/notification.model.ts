import { Schema, model } from "mongoose";
import { INotification, NotificationType } from "../types/notification";

const notificationSchema = new Schema<INotification>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
