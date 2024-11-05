import { v4 as uuidv4 } from "uuid";
import { Order } from "../models/order.model";
import { IOrder, OrderStatus } from "../types/order";

export class OrderService {
  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new Order({
      ...orderData,
      id: uuidv4(),
      status: OrderStatus.PENDING,
    });
    return await order.save();
  }

  async getOrders(): Promise<IOrder[]> {
    return await Order.find();
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId);
  }

  async updateOrder(
    orderId: string,
    orderData: Partial<IOrder>
  ): Promise<IOrder | null> {
    return await Order.findOneAndUpdate({ id: orderId }, orderData, {
      new: true,
    });
  }

  async cancelOrder(orderId: string): Promise<IOrder | null> {
    return await Order.findOneAndUpdate(
      { id: orderId },
      { status: OrderStatus.CANCELLED, updatedAt: new Date() },
      { new: true }
    );
  }

  async getOrdersByCustomerEmail(email: string): Promise<IOrder[]> {
    return await Order.find({ consumerId: email });
  }

  async getOrdersByFarmerEmail(email: string): Promise<IOrder[]> {
    return await Order.find({ farmerId: email });
  }
}
