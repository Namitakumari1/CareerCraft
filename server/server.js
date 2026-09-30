import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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