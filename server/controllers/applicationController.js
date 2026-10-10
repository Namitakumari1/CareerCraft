
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Resume from "../models/Resume.js";

// 1. Create a job application
export const createApplication = async (req, res) => {
    try {
        const {
            company,
            jobTitle,
            resume: resumeId
        } = req.body;

        if (
            typeof company !== "string" ||
            !company.trim() ||
            typeof jobTitle !== "string" ||
            !jobTitle.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Company and job title are required"
            });
        }

        // If a resume is attached, verify that it belongs to this user.
        if (resumeId !== undefined && resumeId !== null && resumeId !== "") {
            if (!mongoose.isValidObjectId(resumeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid resume ID"
                });
            }

            const ownedResume = await Resume.findOne({
                _id: resumeId,
                user: req.user._id
            });

            if (!ownedResume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found"
                });
            }
        }

        // Never accept the owner ID from the client.
        const {
            _id,
            user,
            __v,
            createdAt,
            updatedAt,
            ...data
        } = req.body;

        const application = await Application.create({
            ...data,
            company: company.trim(),
            jobTitle: jobTitle.trim(),
            user: req.user._id,
            resume: resumeId || null
        });

        return res.status(201).json({
            success: true,
            message: "Job application created successfully",
            application
        });
    } catch (error) {
        console.error("Create application error:", error.message);

        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid application data"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while creating application"
        });
    }
};


// 2. Get all applications belonging to the logged-in user
export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            user: req.user._id
        })
            .populate("resume", "title template")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error("Get applications error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching applications"
        });
    }
};


// 3. Get one application belonging to the logged-in user
export const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID"
            });
        }

        const application = await Application.findOne({
            _id: id,
            user: req.user._id
        }).populate("resume", "title template");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        console.error("Get application error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching application"
        });
    }
};


// 4. Update one application belonging to the logged-in user
export const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID"
            });
        }

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

        // If changing the linked resume, verify its ownership too.
        if (
            Object.prototype.hasOwnProperty.call(updates, "resume") &&
            updates.resume !== null &&
            updates.resume !== ""
        ) {
            if (!mongoose.isValidObjectId(updates.resume)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid resume ID"
                });
            }

            const ownedResume = await Resume.findOne({
                _id: updates.resume,
                user: req.user._id
            });

            if (!ownedResume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found"
                });
            }
        }

        if (updates.company !== undefined) {
            if (
                typeof updates.company !== "string" ||
                !updates.company.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Company cannot be empty"
                });
            }

            updates.company = updates.company.trim();
        }

        if (updates.jobTitle !== undefined) {
            if (
                typeof updates.jobTitle !== "string" ||
                !updates.jobTitle.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Job title cannot be empty"
                });
            }

            updates.jobTitle = updates.jobTitle.trim();
        }

        const application = await Application.findOneAndUpdate(
            {
                _id: id,
                user: req.user._id
            },
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        ).populate("resume", "title template");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job application updated successfully",
            application
        });
    } catch (error) {
        console.error("Update application error:", error.message);

        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid application data"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while updating application"
        });
    }
};


// 5. Delete one application belonging to the logged-in user
export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID"
            });
        }

        const application = await Application.findOneAndDelete({
            _id: id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job application deleted successfully"
        });
    } catch (error) {
        console.error("Delete application error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting application"
        });
    }
};