import { v4 as uuidv4 } from "uuid";
import { Payment } from "../models/payment.model";
import { IPayment, PaymentStatus } from "../types/payment";
import { OrderService } from "./order.service";
import { OrderStatus } from "../types/order";

export class PaymentService {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async processPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
    const order = await this.orderService.getOrderById(paymentData.orderId!);
    if (!order) {
      throw new Error("Order not found");
    }

    const payment = new Payment({
      ...paymentData,
      id: uuidv4(),
      status: PaymentStatus.COMPLETED,
    });
    // update the order status to PAID
    await this.orderService.updateOrder(order.id, {
      status: OrderStatus.CONFIRMED,
    });
    return await payment.save();
  }

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus
  ): Promise<IPayment | null> {
    return await Payment.findOneAndUpdate(
      { id: paymentId },
      { status },
      { new: true }
    );
  }

  async processRefund(paymentId: string): Promise<IPayment | null> {
    return await Payment.findOneAndUpdate(
      { id: paymentId },
      { status: PaymentStatus.REFUNDED },
      { new: true }
    );
  }

  async getPaymentHistory(orderId?: string): Promise<IPayment[]> {
    const query = orderId ? { orderId } : {};
    return await Payment.find(query);
  }
}
