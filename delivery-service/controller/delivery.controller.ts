import { Request, Response } from "express";
import deliveryService from "../services/delivery.service";

class DeliveryController {
  async createDelivery(req: Request, res: Response) {
    try {
      const delivery = await deliveryService.createDelivery(req.body);
      res.status(201).json(delivery);
    } catch (error) {
      res.status(500).json({ error: "Failed to create delivery" });
    }
  }

  async updateDeliveryStatus(req: Request, res: Response) {
    try {
      const { deliveryId } = req.params;
      const { status } = req.body;
      const delivery = await deliveryService.updateDeliveryStatus(
        deliveryId,
        status
      );
      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ error: "Failed to update delivery status" });
    }
  }

  async getDeliveryByOrderId(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const delivery = await deliveryService.getDeliveryByOrderId(orderId);
      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch delivery" });
    }
  }

  async getAgentDeliveries(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      const deliveries = await deliveryService.getAgentDeliveries(agentId);
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agent deliveries" });
    }
  }

  // Agent Management
  async createDeliveryAgent(req: Request, res: Response) {
    try {
      const agent = await deliveryService.createDeliveryAgent(req.body);
      res.status(201).json(agent);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create delivery agent" });
    }
  }

  async updateDeliveryAgent(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      const agent = await deliveryService.updateDeliveryAgent(agentId, req.body);
      if (!agent) {
        return res.status(404).json({ error: "Delivery agent not found" });
      }
      res.json(agent);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update delivery agent" });
    }
  }
}

export default new DeliveryController();
