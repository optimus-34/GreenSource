export interface IDelivery {
  orderId: string;
  farmerId: string;
  consumerId: string;
  farmerPhoneNumber: string;
  consumerPhoneNumber: string;
  deliveryAgentId?: string;
  orderPrice: number;
  deliveryAddress: string;
  pickupAddress: string;
  status: "PENDING" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}
