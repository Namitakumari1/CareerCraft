
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Allowed frontend origins
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5174",
].filter(Boolean);

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header, such as
            // direct health checks from tools or the command line.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
    })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// API health-check route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CareerCraft API is running successfully!",
    });
});

// Server
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`CareerCraft server is running on port ${PORT}`);
});