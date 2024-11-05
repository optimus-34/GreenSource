// src/gateway.ts
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticateJWT } from "./middleware/authenticate";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
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

// Finance Service Proxy (protected)
app.use(
  "/api/farmers",
  authenticateJWT,
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
  })
);

app.use(
  "/api/customers",
  authenticateJWT,
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
  })
);

app.use(
  "/api/products",
  authenticateJWT,
  createProxyMiddleware({
    target: "http://localhost:3005",
    changeOrigin: true,
  })
);

app.use(
  "/api/orders",
  authenticateJWT,
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
  })
);

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});
