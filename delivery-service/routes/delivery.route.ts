import express from "express";
import deliveryController from "../controller/delivery.controller";

const router = express.Router();

// Agent Management Routes
router.post("/agents", async (req, res) =>
  deliveryController.createDeliveryAgent(req, res)
);
router.put("/agents/:agentId", async (req, res, next) => {
  try {
    await deliveryController.updateDeliveryAgent(req, res);
  } catch (error) {
    next(error);
  }
});

// Existing Routes
router.post("/deliveries", async (req, res) =>
  deliveryController.createDelivery(req, res)
);
router.put("/deliveries/:deliveryId/status", async (req, res, next) => {
  try {
    await deliveryController.updateDeliveryStatus(req, res);
  } catch (error) {
    next(error);
  }
});
router.get("/deliveries/order/:orderId", async (req, res, next) => {
  try {
    await deliveryController.getDeliveryByOrderId(req, res);
  } catch (error) {
    next(error);
  }
});
router.get("/deliveries/agent/:agentId", async (req, res) =>
  deliveryController.getAgentDeliveries(req, res)
);

export default router;
