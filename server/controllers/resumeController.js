
import mongoose from "mongoose";
import Resume from "../models/Resume.js";

// 1. Create a new resume
export const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Resume title is required"
            });
        }

        const resume = await Resume.create({
            ...req.body,
            title: title.trim(),
            user: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Resume created successfully",
            resume
        });
    } catch (error) {
        console.error("Create resume error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while creating resume"
        });
    }
};


// 2. Get all resumes belonging to the logged-in user
export const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({
            user: req.user._id
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            count: resumes.length,
            resumes
        });
    } catch (error) {
        console.error("Get resumes error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching resumes"
        });
    }
};


// 3. Get one resume belonging to the logged-in user
export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }

        const resume = await Resume.findOne({
            _id: id,
            user: req.user._id
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            success: true,
            resume
        });
    } catch (error) {
        console.error("Get resume error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching resume"
        });
    }
};


// 4. Update one resume belonging to the logged-in user
export const updateResume = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }

        // Never allow clients to change the owner
        const {
            _id,
            user,
            __v,
            createdAt,
            updatedAt,
            ...updates
        } = req.body;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update"
            });
        }

        const resume = await Resume.findOneAndUpdate(
            {
                _id: id,
                user: req.user._id
            },
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            resume
        });
    } catch (error) {
        console.error("Update resume error:", error.message);

        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume data"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while updating resume"
        });
    }
};


// 5. Delete one resume belonging to the logged-in user
export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }

        const resume = await Resume.findOneAndDelete({
            _id: id,
            user: req.user._id
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resume deleted successfully"
        });
    } catch (error) {
        console.error("Delete resume error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting resume"
        });
    }
};