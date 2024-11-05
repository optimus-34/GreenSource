import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(400).json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.getOrders();
      res.json(orders);
    } catch (error: unknown) {
      if (error instanceof Error)
        res.status(400).json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async getOrdersByCustomerEmail(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.getOrdersByCustomerEmail(
        req.params.email
      );
      res.json(orders);
    } catch (error: unknown) {
      if (error instanceof Error) res.json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async getOrdersByFarmerEmail(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.getOrdersByFarmerEmail(
        req.params.email
      );
      res.json(orders);
    } catch (error: unknown) {
      if (error instanceof Error) res.json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.updateOrder(
        req.params.id,
        req.body
      );
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error: unknown) {
      if (error instanceof Error) res.json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error: unknown) {
      if (error instanceof Error) res.json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderService.cancelOrder(req.params.id);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      if (error instanceof Error)
        res.status(400).json({ error: error.message });
      else res.status(500).json({ error: "unknown error occured" });
    }
  }
}
