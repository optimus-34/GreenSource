import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";

const router = Router();
const notificationController = new NotificationController();

router.get("/", (req, res) =>
  notificationController.getNotifications(req, res)
);
router.put("/:id", (req, res) => notificationController.markAsRead(req, res));
router.put("/preferences", (req, res) =>
  notificationController.updatePreferences(req, res)
);

export default router;
