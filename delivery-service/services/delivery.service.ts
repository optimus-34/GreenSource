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
    pickupLocation: { coordinates: [number, number] };
    deliveryLocation: { coordinates: [number, number] };
  }): Promise<IDelivery> {
    const delivery = new Delivery({
      ...deliveryData,
      status: "PENDING",
    });
    await delivery.save();
    await this.assignNearestDeliveryAgent(
      delivery,
      deliveryData.pickupLocation.coordinates,
      deliveryData.deliveryLocation.coordinates
    );
    return delivery;
  }

  private async assignNearestDeliveryAgent(
    delivery: IDelivery,
    pickupCoords: [number, number],
    deliveryCoords: [number, number]
  ): Promise<IDelivery> {
    // Find agents who service both pickup and delivery locations
    const eligibleAgents = await DeliveryAgent.find({
      isAvailable: true,
      serviceLocations: {
        $elemMatch: {
          coordinates: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: pickupCoords,
              },
              $maxDistance: 5000, // 5km in meters
            },
          },
        },
      },
    }).then((agents) =>
      agents.filter((agent) =>
        agent.serviceLocations.some((loc) => {
          const distance = this.calculateDistance(
            loc.coordinates,
            deliveryCoords
          );
          return distance <= loc.radius;
        })
      )
    );

    if (eligibleAgents.length > 0) {
      // Find the closest agent based on current location to pickup point
      const closestAgent = eligibleAgents.reduce((prev, curr) => {
        const prevDistance = this.calculateDistance(
          prev.currentLocation.coordinates,
          pickupCoords
        );
        const currDistance = this.calculateDistance(
          curr.currentLocation.coordinates,
          pickupCoords
        );
        return prevDistance < currDistance ? prev : curr;
      });

      delivery.agentId = closestAgent._id as string;
      delivery.status = "ASSIGNED";
      await delivery.save();

      closestAgent.isAvailable = false;
      await closestAgent.save();
    }

    return delivery;
  }

  private calculateDistance(
    coords1: [number, number],
    coords2: [number, number]
  ): number {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(coords2[1] - coords1[1]);
    const dLon = this.toRad(coords2[0] - coords1[0]);
    const lat1 = this.toRad(coords1[1]);
    const lat2 = this.toRad(coords2[1]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
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
      await DeliveryAgent.findByIdAndUpdate(delivery.agentId, {
        isAvailable: true,
      });
    }

    return delivery;
  }

  async getDeliveryByOrderId(orderId: string): Promise<IDelivery | null> {
    return Delivery.findOne({ orderId: new mongoose.Types.ObjectId(orderId) });
  }

  async getAgentDeliveries(agentId: string): Promise<IDelivery[]> {
    return Delivery.find({
      agentId: new mongoose.Types.ObjectId(agentId),
      status: { $ne: "DELIVERED" },
    });
  }
}

export default new DeliveryService();
