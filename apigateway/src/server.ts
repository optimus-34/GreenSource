// src/gateway.ts
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import {
  authenticateConsumer,
  authenticateFarmer,
  authenticateMultipleRoles,
} from "./middleware/authenticate";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
//Auth Service Proxy
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:8082",
    changeOrigin: true,
  })
);

// Farmer Service Proxy (protected)
app.use(
  "/api/farmers",
  authenticateMultipleRoles(["admin", "farmer", "consumer", "delivery_agent"]),
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
  })
);

app.use(
  "/api/customers",
  authenticateMultipleRoles(["admin", "farmer", "consumer", "delivery_agent"]),
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
  })
);

app.use(
  "/api/products",
  authenticateMultipleRoles(["admin", "farmer", "consumer", "delivery_agent"]),
  createProxyMiddleware({
    target: "http://localhost:3005",
    changeOrigin: true,
  })
);

app.use(
  "/api/orders",
  authenticateMultipleRoles(["admin", "farmer", "consumer", "delivery_agent"]),
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
  })
);

app.use(
  "/api/delivery",
  authenticateMultipleRoles(["admin", "farmer", "consumer", "delivery_agent"]),
  createProxyMiddleware({
    target: "http://localhost:3004",
    changeOrigin: true,
  })
);

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});
