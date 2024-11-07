import Delivery, { IDelivery } from "../models/delivery.model";
import DeliveryAgent, { IDeliveryAgent } from "../models/deliveryAgent.model";
import mongoose from "mongoose";

class DeliveryService {
  // Delivery Agent Management
  async createDeliveryAgent(agentData: {
    name: string;
    email: string;
    phone: string;
    currentLocation: { coordinates: [number, number] };
    serviceLocations: Array<{
      name: string;
      coordinates: [number, number];
      radius: number;
    }>;
  }): Promise<IDeliveryAgent> {
    // Validate service locations (max 5)
    if (agentData.serviceLocations.length > 5) {
      throw new Error("Maximum 5 service locations allowed per agent");
    }
    return await new DeliveryAgent(agentData).save();
  }

  async updateDeliveryAgent(
    agentId: string,
    updateData: Partial<IDeliveryAgent>
  ): Promise<IDeliveryAgent | null> {
    if (updateData.serviceLocations && updateData.serviceLocations.length > 5) {
      throw new Error("Maximum 5 service locations allowed per agent");
    }
    return await DeliveryAgent.findByIdAndUpdate(agentId, updateData, {
      new: true,
    });
  }

  // Delivery Management
  async createDelivery(deliveryData: {
    orderId: string;
    farmerId: string;
    customerId: string;
    pickupLocation: { address: string };
    deliveryLocation: { address: string };
  }): Promise<IDelivery> {
    const delivery = new Delivery({
      ...deliveryData,
      status: "PENDING",
    });
    await delivery.save();
    return delivery;
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: IDelivery["status"]
  ): Promise<IDelivery | null> {
    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status },
      { new: true }
    );

    if (delivery && status === "DELIVERED") {
      // Make agent available again
      await DeliveryAgent.findByIdAndUpdate(delivery.deliveryAgentId, {
        isAvailable: true,
      });
    }

    return delivery;
  }

  async cancelDelivery(deliveryId: string): Promise<IDelivery | null> {
    return Delivery.findByIdAndUpdate(
      deliveryId,
      { status: "CANCELLED" },
      { new: true }
    );
  }

  async getAgentDeliveries(agentId: string): Promise<IDelivery[]> {
    return Delivery.find({ agentId: agentId });
  }

  async getDeliveryAgentById(agentId: string): Promise<IDeliveryAgent | null> {
    return DeliveryAgent.findById(agentId);
  }

  async getDeliveryById(deliveryId: string): Promise<IDelivery | null> {
    return Delivery.findById(deliveryId);
  }

  async getDeliveryAgents(): Promise<IDeliveryAgent[]> {
    return DeliveryAgent.find();
  }

  async deleteDeliveryAgent(agentId: string): Promise<void> {
    await DeliveryAgent.findByIdAndDelete(agentId);
  }

  async getAgentOrders(agentId: string): Promise<IDelivery[]> {
    return Delivery.find({ agentId: agentId });
  }

  async verifyDeliveryAgent(agentId: string): Promise<void> {
    await DeliveryAgent.findByIdAndUpdate(agentId, { isVerified: true });
  }

  async getDeliveryByOrderId(orderId: string): Promise<IDelivery | null> {
    return Delivery.findOne({ orderId: orderId });
  }
}

export default new DeliveryService();
