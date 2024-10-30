import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const payment = await this.paymentService.processPayment(req.body);
      res.status(201).json(payment);
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(400).json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const payment = await this.paymentService.updatePaymentStatus(
        req.params.id,
        req.body.status
      );
      if (!payment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }
      res.json(payment);
    } catch (error: unknown) {
      if (error instanceof Error)
        res.json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async processRefund(req: Request, res: Response): Promise<void> {
    try {
      const payment = await this.paymentService.processRefund(
        req.body.paymentId
      );
      if (!payment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }
      res.json(payment);
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(400).json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async getPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.query;
      const payments = await this.paymentService.getPaymentHistory(
        orderId as string
      );
      res.json(payments);
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(400).json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }
}
