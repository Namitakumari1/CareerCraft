
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {getDashboardSummary} from "../controllers/dashboardController.js";

const router = express.Router();

// Dashboard data is private.
router.use(authMiddleware);

router.get("/summary", getDashboardSummary);

export default router;