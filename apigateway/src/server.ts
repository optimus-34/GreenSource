// src/gateway.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';;
import { authenticateJWT } from './middleware/authenticate';

const app = express();

//Auth Service Proxy
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:8082',
    changeOrigin: true
}));


// Finance Service Proxy (protected)
app.use('/api/farmers',authenticateJWT, createProxyMiddleware({
    target: 'http://localhost:faremerportno',
    changeOrigin: true
}));

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});
