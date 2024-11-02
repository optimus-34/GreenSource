import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";

const router = Router();
const customerController = new CustomerController();

router.post("/", customerController.addCustomer);
router.get("/", customerController.getAllCustomers);
// router.get("/:id", customerController.getCustomerProfile);
router.post("/login", customerController.loginCustomer);
router.put("/:email", customerController.updateCustomerProfile);
router.delete("/:email", customerController.deleteCustomerProfile);

// Order routes
router.post("/:id/orders", customerController.addOrder);
router.get("/:id/orders", customerController.getOrders);
router.post("/:id/orders/:orderId/cancel", customerController.cancelOrder);

// Cart routes
router.get("/:id/cart", customerController.getCart);
router.post("/:id/cart", customerController.addToCart);
router.delete("/:id/cart/:productId", customerController.removeFromCart);

// Address routes
router.get("/:id/addresses", customerController.getAddresses);
router.post("/:id/addresses", customerController.addAddress);
router.put("/:id/addresses/:addressId", customerController.updateAddress);
router.delete("/:id/addresses/:addressId", customerController.deleteAddress);

// Wishlist routes without authentication
router.get("/:id/wishlist", customerController.getWishlist);
router.get("/:id/wishlist", customerController.getWishlist);
router.post("/:id/wishlist", customerController.addToWishlist);
router.delete(
  "/:id/wishlist/:productId",
  customerController.removeFromWishlist
);

export default router;
