import { Request, Response, NextFunction } from "express";
import { CustomerService } from "../services/customer.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.customerService.getAllCustomers(page, limit);

      res.json({
        success: true,
        data: result.customers,
        meta: {
          pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getCustomerProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customer = await this.customerService.getCustomerById(
        req.params.id
      );
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  updateCustomerProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customer = await this.customerService.updateCustomer(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  deleteCustomerProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.customerService.deleteCustomer(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  };

  addAddress = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customer = await this.customerService.addAddress(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customer = await this.customerService.updateAddress(
        req.params.id,
        req.params.addressId,
        req.body
      );
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  deleteAddress = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customer = await this.customerService.deleteAddress(
        req.params.id,
        req.params.addressId
      );
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  getWishlist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const wishlist = await this.customerService.getWishlist(req.params.id);
      res.json({ success: true, data: wishlist });
    } catch (error) {
      next(error);
    }
  };

  addToWishlist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customer = await this.customerService.addToWishlist(
        req.params.id,
        req.body.productId
      );
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  removeFromWishlist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customer = await this.customerService.removeFromWishlist(
        req.params.id,
        req.params.productId
      );
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };
}
