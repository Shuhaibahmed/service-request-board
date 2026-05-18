import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jobRoutes from "./routes/jobs.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Debug check - remove after confirming works
console.log("ENV CHECK - MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ NOT SET");

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Service Request Board API is running 🚀", status: "OK" });
});

// API Routes
app.use("/api/jobs", jobRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB then start server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not set in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

startServer();
