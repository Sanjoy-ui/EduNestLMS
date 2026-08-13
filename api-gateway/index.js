import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';
import rateLimit from 'express-rate-limit';
import verifyGatewayAuth from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const BACKEND_SERVICE_URL = process.env.BACKEND_SERVICE_URL || 'http://localhost:5000';
const STORAGE_SERVICE_URL = process.env.STORAGE_SERVICE_URL || 'http://localhost:5001';

// Centralized CORS Configuration
const allowedOrigins = [
  'http://localhost',
  'http://localhost:80',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// Request Logger & Cookie Parser
app.use(morgan('dev'));
app.use(cookieParser());

// Rate Limiting (1000 requests per 15 mins for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Health Check Endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

// Centralized Authentication Middleware
app.use(verifyGatewayAuth);

// ==============================================================================
// Reverse Proxy Routes to Downstream Microservices
// ==============================================================================

// 1. Route `/api/v1/*` -> Main Backend Service (Port 5000/8000)
app.use('/api/v1', proxy(BACKEND_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/v1${req.url}`;
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.userId) {
      proxyReqOpts.headers['x-user-id'] = srcReq.userId;
    }
    return proxyReqOpts;
  },
  userResHeaderDecorator(headers) {
    if (headers['access-control-allow-origin'] === '*') {
      delete headers['access-control-allow-origin'];
    }
    return headers;
  }
}));

// 2. Route `/api/storage/*` -> Storage Microservice (Port 5001)
app.use('/api/storage', proxy(STORAGE_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/storage${req.url}`;
  },
  parseReqBody: false, // Essential for streaming multipart/form-data video & image file uploads!
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.userId) {
      proxyReqOpts.headers['x-user-id'] = srcReq.userId;
    }
    return proxyReqOpts;
  },
  userResHeaderDecorator(headers) {
    if (headers['access-control-allow-origin'] === '*') {
      delete headers['access-control-allow-origin'];
    }
    return headers;
  }
}));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Gateway Error:', err);
  res.status(500).json({ success: false, message: err.message || 'API Gateway Error' });
});

app.listen(PORT, () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);
  console.log(`├── Downstream Backend: ${BACKEND_SERVICE_URL}`);
  console.log(`└── Downstream Storage: ${STORAGE_SERVICE_URL}`);
});
