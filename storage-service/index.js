import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import storageRouter from './routes/storageRoute.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Dynamic CORS configuration to support API Gateway & Frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://edu-nest-lms.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check at root
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'storage-service' });
});

// Routes
app.use('/api/storage', storageRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Storage Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Storage Service Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Storage Service running on port ${PORT}`);
});
