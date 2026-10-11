
import Application from "../models/Application.js";
import Resume from "../models/Resume.js";

// GET /api/dashboard/summary
export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();

        // Run independent database queries in parallel.
        const [totalResumes,totalApplications,statusResults,upcomingInterviews,recentApplications] =
         await Promise.all([
            // Total resumes owned by the logged-in user
            Resume.countDocuments({
                user: userId
            }),

            // Total applications owned by the logged-in user
            Application.countDocuments({
                user: userId
            }),

            // Count applications grouped by status
            Application.aggregate([
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Interviews scheduled for today or a future date
            Application.find({
                user: userId,
                status: "Interview",
                interviewDate: {
                    $gte: now
                }
            })
                .select("company jobTitle interviewDate location")
                .sort({ interviewDate: 1 })
                .limit(5)
                .lean(),

            // Five most recently updated applications
            Application.find({
                user: userId
            })
                .select(
                    "company jobTitle status location updatedAt"
                )
                .sort({ updatedAt: -1 })
                .limit(5)
                .lean()
        ]);

        // Include all statuses even when their count is zero.
        const applicationsByStatus = {
            Wishlist: 0,
            Applied: 0,
            Interview: 0,
            Offer: 0,
            Rejected: 0
        };

        for (const item of statusResults) {
            applicationsByStatus[item._id] = item.count;
        }

        return res.status(200).json({
            success: true,
            message: "Dashboard summary fetched successfully",

            summary: {
                totalResumes,
                totalApplications,
                applicationsByStatus,
                upcomingInterviews,
                recentApplications
            }
        });
    } catch (error) {
        console.error(
            "Dashboard summary error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error while fetching dashboard"
        });
    }
};