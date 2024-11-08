import { Request, Response } from "express";
import deliveryService from "../services/delivery.service";
import axios from "axios";

class DeliveryController {
  // Delivery Agent Controllers
  async createDeliveryAgent(req: Request, res: Response) {
    try {
      // Ensure required fields are present
      const { name, email, phoneNumber } = req.body;
      if (!name || !email || !phoneNumber) {
        return res.status(400).json({
          error: "Name, email, and phone number are required",
        });
      }

      // Initialize serviceLocations as empty array if not provided
      const agentData = {
        ...req.body,
        serviceLocations: req.body.serviceLocations || [],
      };

      const agent = await deliveryService.createDeliveryAgent(agentData);
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

  async getDeliveryAgentByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const agent = await deliveryService.getDeliveryAgentByEmail(email);
      res.json(agent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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

  async getAvailableAgents(req: Request, res: Response) {
    try {
      const agents = await deliveryService.getAvailableAgents();
      res.json(agents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async decreaseDeliveryAgentOrderCount(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      const agent = await deliveryService.decreaseDeliveryAgentOrderCount(
        agentId
      );
      res.json(agent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addDeliveryAgentIdToDelivery(req: Request, res: Response) {
    try {
      const { deliveryId, agentId } = req.params;
      const delivery = await deliveryService.addDeliveryAgentIdToDelivery(
        deliveryId,
        agentId
      );
      res.json(delivery);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateDeliveryAgentOrderCount(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      const agent = await deliveryService.updateDeliveryAgentOrderCount(
        agentId
      );
      res.json(agent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
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

  async getAvailableAgentsForLocations(req: Request, res: Response) {
    try {
      const serviceLocations = req.query.serviceLocations as string[];

      if (!serviceLocations || !Array.isArray(serviceLocations)) {
        return res.status(400).json({
          error:
            "serviceLocations query parameter is required and must be an array",
        });
      }

      const agents = await deliveryService.getAvailableAgentsForLocations(
        serviceLocations
      );
      res.json(agents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DeliveryController();
