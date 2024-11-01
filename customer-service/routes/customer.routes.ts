import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";

const router = Router();
const customerController = new CustomerController();

router.post("/", customerController.addCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerProfile);
router.put("/:id", customerController.updateCustomerProfile);
router.delete("/:id", customerController.deleteCustomerProfile);

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
