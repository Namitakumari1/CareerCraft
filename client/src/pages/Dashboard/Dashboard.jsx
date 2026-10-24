import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardApi } from "../../services/api";
import "./Dashboard.css";
import Navbar from "../../components/Navbar.jsx";

const initialSummary = {
    totalResumes: 0,
    totalApplications: 0,
    applicationsByStatus: {
        Wishlist: 0,
        Applied: 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0,
    },
    upcomingInterviews: [],
    recentApplications: [],
};

function Dashboard() {
    
    const [summary, setSummary] = useState(initialSummary);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            try {
                const data = await dashboardApi.getSummary();

                if (active) {
                    setSummary({
                        ...initialSummary,
                        ...data.summary,
                        applicationsByStatus: {
                            ...initialSummary.applicationsByStatus,
                            ...data.summary?.applicationsByStatus,
                        },
                    });
                }
            } catch (err) {
                if (active) {
                    setError(err.message);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const statusEntries = Object.entries(
        summary.applicationsByStatus
    );

    return (
        <main className="dashboard-page">
            
            <Navbar />

            <section className="dashboard-content">
                <div className="dashboard-welcome">
                    <div>
                        <p className="dashboard-eyebrow">
                            YOUR CAREER WORKSPACE
                        </p>
                        <h1>Your career, organized.</h1>
                        <p className="dashboard-subtitle">
                            Track your applications and build your
                            next opportunity.
                        </p>
                    </div>

                    <Link
                        className="dashboard-primary-button"
                        to="/resume-builder"
                    >
                        + Create resume
                    </Link>
                </div>

                {loading && (
                    <p className="dashboard-message">
                        Loading your dashboard...
                    </p>
                )}

                {error && (
                    <div className="dashboard-error">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="dashboard-stat-grid">
                            <article className="dashboard-stat-card">
                                <span className="stat-icon">▤</span>
                                <p>Total resumes</p>
                                <strong>{summary.totalResumes}</strong>
                                <small>Your professional profiles</small>
                            </article>

                            <article className="dashboard-stat-card">
                                <span className="stat-icon">▣</span>
                                <p>Total applications</p>
                                <strong>{summary.totalApplications}</strong>
                                <small>Your tracked opportunities</small>
                            </article>

                            <article className="dashboard-stat-card">
                                <span className="stat-icon">◷</span>
                                <p>Interviews</p>
                                <strong>
                                    {summary.applicationsByStatus.Interview}
                                </strong>
                                <small>Applications at interview stage</small>
                            </article>

                            <article className="dashboard-stat-card">
                                <span className="stat-icon">★</span>
                                <p>Offers</p>
                                <strong>
                                    {summary.applicationsByStatus.Offer}
                                </strong>
                                <small>Offers received</small>
                            </article>
                        </div>

                        <div className="dashboard-panels">
                            <section className="dashboard-panel">
                                <div className="dashboard-panel-heading">
                                    <div>
                                        <h2>Application pipeline</h2>
                                        <p>Track your progress by status.</p>
                                    </div>

                                    <Link to="/applications">
                                        View all
                                    </Link>
                                </div>

                                <div className="status-list">
                                    {statusEntries.map(([status, count]) => (
                                        <div
                                            className="status-row"
                                            key={status}
                                        >
                                            <span>{status}</span>
                                            <strong>{count}</strong>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="dashboard-panel">
                                <div className="dashboard-panel-heading">
                                    <div>
                                        <h2>Upcoming interviews</h2>
                                        <p>Your scheduled interview dates.</p>
                                    </div>
                                </div>

                                {summary.upcomingInterviews.length === 0 ? (
                                    <div className="dashboard-empty">
                                        <span>◷</span>
                                        <p>No upcoming interviews yet.</p>
                                        <small>
                                            Applications with scheduled
                                            interviews will appear here.
                                        </small>
                                    </div>
                                ) : (
                                    <div className="dashboard-record-list">
                                        {summary.upcomingInterviews.map(
                                            (item) => (
                                                <article
                                                    className="dashboard-record"
                                                    key={item._id}
                                                >
                                                    <strong>
                                                        {item.company}
                                                    </strong>
                                                    <span>
                                                        {item.jobTitle}
                                                    </span>
                                                    <small>
                                                        {item.interviewDate
                                                            ? new Date(
                                                                item.interviewDate
                                                            ).toLocaleDateString()
                                                            : "Date not set"}
                                                    </small>
                                                </article>
                                            )
                                        )}
                                    </div>
                                )}
                            </section>
                        </div>

                        <section className="dashboard-panel dashboard-recent">
                            <div className="dashboard-panel-heading">
                                <div>
                                    <h2>Recent applications</h2>
                                    <p>Your latest career opportunities.</p>
                                </div>

                                <Link to="/applications">
                                    Manage applications
                                </Link>
                            </div>

                            {summary.recentApplications.length === 0 ? (
                                <div className="dashboard-empty">
                                    <span>▤</span>
                                    <p>No applications to display yet.</p>
                                    <small>
                                        Start tracking your next opportunity.
                                    </small>
                                    <Link
                                        className="dashboard-primary-button"
                                        to="/applications"
                                    >
                                        Add an application
                                    </Link>
                                </div>
                            ) : (
                                <div className="dashboard-table-wrap">
                                    <table className="dashboard-table">
                                        <thead>
                                            <tr>
                                                <th>Company</th>
                                                <th>Job title</th>
                                                <th>Status</th>
                                                <th>Date added</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary.recentApplications.map(
                                                (item) => (
                                                    <tr key={item._id}>
                                                        <td>{item.company}</td>
                                                        <td>{item.jobTitle}</td>
                                                        <td>
                                                            <span className="status-badge">
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {item.createdAt
                                                                ? new Date(
                                                                    item.createdAt
                                                                ).toLocaleDateString()
                                                                : "—"}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </section>
        </main>
    );
}

export default Dashboard;