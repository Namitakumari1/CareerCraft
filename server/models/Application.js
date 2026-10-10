
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        // User who owns this job application
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Company and job details
        company: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        jobType: {
            type: String,
            enum: [
                "Full-time",
                "Part-time",
                "Internship",
                "Contract",
                "Remote"
            ],
            default: "Full-time"
        },

        location: {
            type: String,
            trim: true,
            default: ""
        },

        jobUrl: {
            type: String,
            trim: true,
            default: ""
        },

        // Application progress
        status: {
            type: String,
            enum: [
                "Wishlist",
                "Applied",
                "Interview",
                "Offer",
                "Rejected"
            ],
            default: "Wishlist",
            index: true
        },

        appliedDate: {
            type: Date,
            default: null
        },

        interviewDate: {
            type: Date,
            default: null
        },

        // Optional compensation details
        salary: {
            type: String,
            trim: true,
            default: ""
        },

        // Personal notes about the application
        notes: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: ""
        },

        // Optional link to a resume created in CareerCraft
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Efficiently find a user's applications, newest first
applicationSchema.index({
    user: 1,
    createdAt: -1
});

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;