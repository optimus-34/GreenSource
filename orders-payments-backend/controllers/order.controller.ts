import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import axios from "axios";
import { IOrder, IShippingAddress } from "../types/order";

interface IOrderWithId extends IOrder {
  _id: string;
}

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      // Get farmer's address and contact details first
      const [farmerAddressRes, farmerDetailsRes, consumerDetailsRes] =
        await Promise.all([
          axios.get(
            `http://localhost:3002/api/farmers/${req.body.farmerId}/get/address`
          ),
          axios.get(`http://localhost:3002/api/farmers/${req.body.farmerId}`),
          axios.get(
            `http://localhost:3001/api/customers/${req.body.consumerId}`
          ),
        ]);

      const farmerAddress = JSON.stringify(farmerAddressRes.data.address);
      const farmerPhoneNumber = farmerDetailsRes.data.phone;
      const consumerPhoneNumber = consumerDetailsRes.data.data.phone;
      const consumerAddress = JSON.stringify(
        consumerDetailsRes.data.data.addresses[0]
      );

      // Create the order
      const order = (await this.orderService.createOrder(
        req.body
      )) as IOrderWithId;
      console.log("order", order, 1);

      try {
        // Update farmer's orders
        await axios.post(
          `http://localhost:3002/api/farmers/${order.farmerId}/add/order`,
          {
            orderId: order._id,
            amount: order.totalAmount,
          }
        );
        console.log("order", order, 2);

        // Update consumer's orders
        await axios.post(
          `http://localhost:3001/api/customers/${order.consumerId}/orders`,
          { orderId: order._id }
        );
        console.log("order", order, 3);

        const deliveryData = {
          orderId: order._id.toString(),
          farmerId: order.farmerId,
          consumerId: order.consumerId,
          deliveryAddress: consumerAddress,
          pickupAddress: farmerAddress,
          orderPrice: order.totalAmount,
          farmerPhoneNumber: farmerPhoneNumber,
          consumerPhoneNumber: consumerPhoneNumber,
          status: "PENDING",
        };
        console.log("deliveryData", deliveryData, 1);

        // Create delivery entry
        await axios.post(`http://localhost:3004/`, deliveryData);
        console.log("order", order, 4);

        res.status(201).json(order);
      } catch (error) {
        // If any of the subsequent operations fail, cancel the order
        await this.orderService.cancelOrder(order._id);
        throw new Error(
          error instanceof Error ? error.message : "Failed to process order"
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
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
      res.status(200).json(orders);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "unknown error occurred" });
      }
    }
  }

  async getOrdersByFarmerEmail(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.getOrdersByFarmerEmail(
        req.params.email
      );
      res.status(200).json(orders);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "unknown error occurred" });
      }
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
      res.status(200).json(order);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "unknown error occurred" });
      }
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
