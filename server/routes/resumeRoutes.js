
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {createResume,getResumes,getResumeById,updateResume,deleteResume} from "../controllers/resumeController.js";

const router = express.Router();

// All resume routes require authentication
router.use(authMiddleware);

router.post("/", createResume);

router.get("/", getResumes);

router.get("/:id", getResumeById);

router.put("/:id", updateResume);

router.delete("/:id", deleteResume);

export default router;