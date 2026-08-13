import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import aiRouter from "./routes/aiRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

dotenv.config();

let port = process.env.PORT || 5000;
let app = express();

app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration to support API Gateway & Frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000",
  "https://edu-nest-lms.vercel.app",
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

// Support both /api/v1/* (via API Gateway) and /api/* (legacy direct calls)
app.use(["/api/v1/auth", "/api/auth"], authRouter);
app.use(["/api/v1/user", "/api/user"], userRouter);
app.use(["/api/v1/course", "/api/course"], courseRouter);
app.use(["/api/v1/payment", "/api/payment"], paymentRouter);
app.use(["/api/v1/ai", "/api/ai"], aiRouter);
app.use(["/api/v1/review", "/api/review"], reviewRouter);

app.get("/", (req, res) => {
  res.send("Hello From EduNest LMS Server");
});

app.listen(port, () => {
  console.log(`🚀 Backend Server Running on Port ${port}`);
  connectDb();
});
