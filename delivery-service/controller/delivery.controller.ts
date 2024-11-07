import { Request, Response } from "express";
import deliveryService from "../services/delivery.service";
import axios from "axios";

class DeliveryController {
  // Delivery Agent Controllers
  async createDeliveryAgent(req: Request, res: Response) {
    try {
      const agent = await deliveryService.createDeliveryAgent(req.body);
      res.status(201).json(agent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDeliveryAgents(req: Request, res: Response) {
    try {
      const agents = await deliveryService.getDeliveryAgents();
      res.json(agents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAgentDeliveries(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      const deliveries = await deliveryService.getAgentDeliveries(agentId);
      res.json(deliveries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delivery Controllers
  async createDelivery(req: Request, res: Response) {
    try {
      const delivery = await deliveryService.createDelivery(req.body);
      res.status(201).json(delivery);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDeliveryAgentById(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      const agent = await deliveryService.getDeliveryAgentById(agentId);
      res.json(agent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDeliveryByOrderId(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const delivery = await deliveryService.getDeliveryByOrderId(orderId);
      res.json(delivery);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelDelivery(req: Request, res: Response) {
    try {
      const { deliveryId } = req.params;
      const delivery = await deliveryService.cancelDelivery(deliveryId);
      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      await axios.put(
        `http://localhost:3003/api/orders/${delivery.orderId}/cancel`,
        {
          status: "CANCELLED",
        }
      );
      res.json(delivery);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDeliveryById(req: Request, res: Response) {
    try {
      const { deliveryId } = req.params;
      const delivery = await deliveryService.getDeliveryById(deliveryId);
      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DeliveryController();
