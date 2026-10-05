import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CareerCraft API is running successfully!"
    });
});

// Server
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`CareerCraft server is running on port ${PORT}`);
});