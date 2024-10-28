import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();
const paymentController = new PaymentController();

router.post("/", (req, res) => paymentController.processPayment(req, res));
router.post("/:id", (req, res) =>
  paymentController.updatePaymentStatus(req, res)
);
router.post("/refund", (req, res) => paymentController.processRefund(req, res));
router.get("/history", (req, res) =>
  paymentController.getPaymentHistory(req, res)
);

export default router;
