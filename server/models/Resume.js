
import mongoose from "mongoose";

const personalInfoSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            default: ""
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },
        phone: {
            type: String,
            trim: true,
            default: ""
        },
        location: {
            type: String,
            trim: true,
            default: ""
        },
        linkedIn: {
            type: String,
            trim: true,
            default: ""
        },
        portfolio: {
            type: String,
            trim: true,
            default: ""
        }
    },
    { _id: false }
);

const educationSchema = new mongoose.Schema(
    {
        institution: {
            type: String,
            trim: true,
            default: ""
        },
        degree: {
            type: String,
            trim: true,
            default: ""
        },
        fieldOfStudy: {
            type: String,
            trim: true,
            default: ""
        },
        startDate: {
            type: String,
            default: ""
        },
        endDate: {
            type: String,
            default: ""
        },
        grade: {
            type: String,
            trim: true,
            default: ""
        },
        description: {
            type: String,
            trim: true,
            default: ""
        }
    },
    { _id: true }
);

const experienceSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            trim: true,
            default: ""
        },
        position: {
            type: String,
            trim: true,
            default: ""
        },
        startDate: {
            type: String,
            default: ""
        },
        endDate: {
            type: String,
            default: ""
        },
        currentlyWorking: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            trim: true,
            default: ""
        }
    },
    { _id: true }
);

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            default: ""
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        technologies: [{
            type: String,
            trim: true
        }],
        projectUrl: {
            type: String,
            trim: true,
            default: ""
        }
    },
    { _id: true }
);

const certificationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: ""
        },
        issuer: {
            type: String,
            trim: true,
            default: ""
        },
        issueDate: {
            type: String,
            default: ""
        },
        credentialUrl: {
            type: String,
            trim: true,
            default: ""
        }
    },
    { _id: true }
);

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        template: {
            type: String,
            enum: ["modern", "professional", "minimal"],
            default: "modern"
        },

        personalInfo: {
            type: personalInfoSchema,
            default: () => ({})
        },

        professionalSummary: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },

        education: {
            type: [educationSchema],
            default: []
        },

        experience: {
            type: [experienceSchema],
            default: []
        },

        skills: {
            type: [{
                type: String,
                trim: true
            }],
            default: []
        },

        projects: {
            type: [projectSchema],
            default: []
        },

        certifications: {
            type: [certificationSchema],
            default: []
        },

        achievements: {
            type: [{
                type: String,
                trim: true
            }],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;