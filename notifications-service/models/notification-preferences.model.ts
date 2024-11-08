import { Schema, model } from "mongoose";
import { INotificationPreferences } from "../types/notification";

const notificationPreferencesSchema = new Schema<INotificationPreferences>({
  userId: { type: String, required: true, unique: true },
  emailEnabled: { type: Boolean, default: true },
  pushEnabled: { type: Boolean, default: true },
  preferences: {
    type: Map,
    of: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    default: {},
  },
});

export const NotificationPreferences = model<INotificationPreferences>(
  "NotificationPreferences",
  notificationPreferencesSchema
);
