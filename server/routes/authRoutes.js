import express from "express";
import { registerUser, loginUser, getCurrentUser, adminTest } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, getCurrentUser);

router.get("/admin-test", authMiddleware, authorizeRoles("admin"), adminTest);

export default router;