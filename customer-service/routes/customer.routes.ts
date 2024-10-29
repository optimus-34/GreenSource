import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const customerController = new CustomerController();

// Customer profile routes
// router.get("/", authenticate, customerController.getAllCustomers); // using authenticate middleware
// router.get("/:id", authenticate, customerController.getCustomerProfile); // using authenticate middleware
// router.put("/:id", authenticate, customerController.updateCustomerProfile); // using authenticate middleware
// router.delete("/:id", authenticate, customerController.deleteCustomerProfile); // using authenticate middleware

// Customer profile routes without authentication
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerProfile);
router.put("/:id", customerController.updateCustomerProfile);
router.delete("/:id", customerController.deleteCustomerProfile);

// Address routes
router.get(
  "/:id/addresses",
  // authenticate,
  customerController.getCustomerProfile
);
router.post("/:id/addresses", authenticate, customerController.addAddress);
router.put(
  "/:id/addresses/:addressId",
  // authenticate,
  customerController.updateAddress
);
router.delete(
  "/:id/addresses/:addressId",
  // authenticate,
  customerController.deleteAddress
);

// Wishlist routes
// router.get("/:id/wishlist", authenticate, customerController.getWishlist); // using authenticate middleware
// router.post("/:id/wishlist", authenticate, customerController.addToWishlist); // using authenticate middleware
// router.delete(
//   "/:id/wishlist/:productId",
//   authenticate,
//   customerController.removeFromWishlist
// ); // using authenticate middleware

// Wishlist routes without authentication
router.get("/:id/wishlist", customerController.getWishlist);
router.get("/:id/wishlist", customerController.getWishlist);
router.post("/:id/wishlist", customerController.addToWishlist);
router.delete(
  "/:id/wishlist/:productId",
  customerController.removeFromWishlist
);

export default router;
