import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const result = await this.notificationService.getNotifications(
        userId,
        page,
        limit
      );
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof Error) res.json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const notification = await this.notificationService.markAsRead(
        id,
        userId
      );

      if (!notification) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }

      res.json(notification);
    } catch (error: unknown) {
      if (error instanceof Error) res.json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const { userId, ...preferencesData } = req.body;

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const preferences = await this.notificationService.updatePreferences(
        userId,
        preferencesData
      );
      res.json(preferences);
    } catch (error: unknown) {
      if (error instanceof Error) res.json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }
}
