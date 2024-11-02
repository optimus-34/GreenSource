import { CustomerModel } from "../models/customer.model";
import { Customer, Address } from "../types/customer";
import { AppError } from "../types/error";
import { IOrder } from "../types/order";

export class CustomerService {
  async getAllCustomers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ customers: Customer[]; total: number }> {
    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      CustomerModel.find().skip(skip).limit(limit),
      CustomerModel.countDocuments(),
    ]);
    return { customers, total };
  }

  async addCustomer(data: Customer): Promise<Customer> {
    const customer = new CustomerModel(data);
    return customer.save();
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = await CustomerModel.findOne({ user_id: id });
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }

  async getCustomerByEmail(email: string): Promise<Customer> {
    const customer = await CustomerModel.findOne({ email: email });
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }

  async updateCustomer(
    email: string,
    data: Partial<Customer>
  ): Promise<Customer> {
    const customer = await CustomerModel.findOneAndUpdate(
      { email: email },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }

  async deleteCustomer(id: string): Promise<void> {
    const result = await CustomerModel.findOneAndDelete({ email: id });
    if (!result) {
      throw new AppError(404, "Customer not found");
    }
  }

  async addAddress(
    email: string,
    address: Omit<Address, "id" | "customerId">
  ): Promise<Customer> {
    const customer = await CustomerModel.findOne({ email: email });
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }

    if (address.isDefault) {
      customer.addresses.forEach((addr) => (addr.isDefault = false));
    }
    customer.addresses.push(address as Address);
    await customer.save();
    return customer;
  }

  async updateAddress(
    email: string,
    addressId: string,
    addressData: Partial<Address>
  ): Promise<Customer> {
    const customer = await CustomerModel.findOne({ email: email });
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }

    const address = customer.addresses.find((addr) => addr.id === addressId);
    if (!address) {
      throw new AppError(404, "Address not found");
    }

    Object.assign(address, addressData);
    await customer.save();
    return customer;
  }

  async deleteAddress(email: string, addressId: string): Promise<Customer> {
    const customer = await CustomerModel.findOne({ email: email });
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }

    customer.addresses = customer.addresses.filter(
      (addr) => addr.id !== addressId
    );
    await customer.save();
    return customer;
  }

  async getAddresses(email: string): Promise<Address[]> {
    const customer = await CustomerModel.findOne({ email: email });
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer.addresses;
  }

  async getOrders(email: string): Promise<string[]> {
    const customer = await CustomerModel.findOne({ email: email });
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer.orders;
  }

  async getCart(email: string): Promise<string[]> {
    const customer = await CustomerModel.findOne({ email: email });
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer.cart;
  }

  async addToCart(email: string, productId: string): Promise<Customer> {
    const customer = await CustomerModel.findByIdAndUpdate(
      { email: email },
      { $addToSet: { cart: productId } },
      { new: true }
    );
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }

  async removeFromCart(email: string, productId: string): Promise<Customer> {
    const customer = await CustomerModel.findOneAndUpdate(
      { email: email },
      { $pull: { cart: productId } },
      { new: true }
    );
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }

  async addOrder(
    email: string,
    order: Omit<IOrder, "id" | "customerId">
  ): Promise<Customer> {
    const customer = await CustomerModel.findOneAndUpdate(
      { email: email },
      { $addToSet: { orders: order } },
      { new: true }
    );
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }

  async cancelOrder(email: string, orderId: string): Promise<Customer> {
    const customer = await CustomerModel.findOneAndUpdate(
      { email: email },
      { $pull: { orders: orderId } },
      { new: true }
    );
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }

  async getWishlist(customerId: string): Promise<string[]> {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer.wishlist;
  }

  async addToWishlist(
    customerId: string,
    productId: string
  ): Promise<Customer> {
    const customer = await CustomerModel.findByIdAndUpdate(
      customerId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    );
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }

  async removeFromWishlist(
    customerId: string,
    productId: string
  ): Promise<Customer> {
    const customer = await CustomerModel.findByIdAndUpdate(
      customerId,
      { $pull: { wishlist: productId } },
      { new: true }
    );
    if (!customer) {
      throw new AppError(404, "Customer not found");
    }
    return customer;
  }
}
