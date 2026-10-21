
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applicationApi, authApi } from "../../services/api";
import "./Applications.css";

const PAGE_SIZE = 5;

const INITIAL_FORM = {
    company: "",
    jobTitle: "",
    jobType: "Full-time",
    location: "",
    jobUrl: "",
    status: "Wishlist",
    appliedDate: "",
    interviewDate: "",
    salary: "",
    notes: "",
};

const STATUSES = [
    "Wishlist",
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
];

const JOB_TYPES = [
    "Full-time",
    "Part-time",
    "Internship",
    "Contract",
    "Remote",
];

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function Applications() {
    const [applications, setApplications] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: PAGE_SIZE,
        totalApplications: 0,
        totalPages: 1,
    });

    const [form, setForm] = useState(INITIAL_FORM);
    const [editingId, setEditingId] = useState(null);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch applications whenever search, status or page changes.
    useEffect(() => {
        let cancelled = false;

        async function fetchApplications() {
            setLoading(true);
            setError("");

            try {
                const data = await applicationApi.getAll({
                    page: String(page),
                    limit: String(PAGE_SIZE),
                    ...(search ? { search } : {}),
                    ...(status ? { status } : {}),
                });

                if (cancelled) return;

                setApplications(data.applications || []);
                setPagination(
                    data.pagination || {
                        currentPage: page,
                        pageSize: PAGE_SIZE,
                        totalApplications: 0,
                        totalPages: 1,
                    }
                );
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                    setApplications([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchApplications();

        return () => {
            cancelled = true;
        };
    }, [page, search, status, refreshKey]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearch("");
        setStatus("");
        setPage(1);
        setError("");
        setNotice("");
    };

    const resetForm = () => {
        setForm(INITIAL_FORM);
        setEditingId(null);
    };

    const handleEdit = (application) => {
        setForm({
            company: application.company || "",
            jobTitle: application.jobTitle || "",
            jobType: application.jobType || "Full-time",
            location: application.location || "",
            jobUrl: application.jobUrl || "",
            status: application.status || "Wishlist",
            appliedDate: application.appliedDate
                ? application.appliedDate.slice(0, 10)
                : "",
            interviewDate: application.interviewDate
                ? application.interviewDate.slice(0, 10)
                : "",
            salary: application.salary || "",
            notes: application.notes || "",
        });

        setEditingId(application._id);
        setError("");
        setNotice("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");

        const payload = {
            company: form.company.trim(),
            jobTitle: form.jobTitle.trim(),
            jobType: form.jobType,
            location: form.location.trim(),
            status: form.status,
            appliedDate: form.appliedDate || null,
            interviewDate: form.interviewDate || null,
            salary: form.salary.trim(),
            notes: form.notes.trim(),
        };

        // Only send a job URL when the user has entered one.
        if (form.jobUrl.trim()) {
            payload.jobUrl = form.jobUrl.trim();
        }

        try {
            setSaving(true);

            if (editingId) {
                await applicationApi.update(editingId, payload);
                setNotice("Application updated successfully.");
            } else {
                await applicationApi.create(payload);
                setNotice("Application created successfully.");
            }

            resetForm();

            setRefreshKey((previous) => previous + 1);

            // Return to page 1 so the newest record is easy to find.
            setPage(1);
            setSearch("");
            setSearchInput("");
            setStatus("");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) return;

        setError("");
        setNotice("");

        try {
            await applicationApi.remove(id);
            setNotice("Application deleted successfully.");

            // If this was the last item on a later page,
            // move back one page.

            // if (applications.length === 1 && page > 1) {
            //     setPage((previous) => previous - 1);
            // } else {
            //     // Changing a state variable forces a new request.
            //     // Refresh by resetting and reapplying the current page.
            //     setPage((previous) => previous === 1 ? 0 : previous);
            // }
            if (applications.length === 1 && page > 1) {
                setPage((previous) => previous - 1);
            } else {
                setRefreshKey((previous) => previous + 1);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        authApi.logout();
        window.location.replace("/login");
    };

    const totalPages = Math.max(
        1,
        pagination.totalPages || 1
    );

    return (
        <main className="applications-page">
            <header className="applications-header">
                <Link className="applications-brand" to="/dashboard">
                    <span className="brand-mark">C</span>
                    CareerCraft
                </Link>

                <nav className="applications-nav">
                    <Link to="/dashboard">Dashboard</Link>

                    <button
                        type="button"
                        className="applications-logout"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </nav>
            </header>

            <section className="applications-content">
                <div className="applications-heading">
                    <div>
                        <p className="applications-eyebrow">
                            YOUR CAREER WORKSPACE
                        </p>

                        <h1>Job applications</h1>

                        <p className="applications-subtitle">
                            Organize your opportunities and track
                            every step of your job search.
                        </p>
                    </div>

                    <div className="applications-total">
                        <span>Total applications</span>
                        <strong>{pagination.totalApplications ?? 0}</strong>
                    </div>
                </div>

                {notice && (
                    <p className="applications-notice" role="status">
                        {notice}
                    </p>
                )}

                {error && (
                    <p className="applications-error" role="alert">
                        {error}
                    </p>
                )}

                <section className="application-form-card">
                    <div className="application-section-heading">
                        <div>
                            <h2>
                                {editingId
                                    ? "Edit application"
                                    : "Add a job application"}
                            </h2>

                            <p>
                                Enter the details of the opportunity
                                you want to track.
                            </p>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                className="application-secondary-button"
                                onClick={resetForm}
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="application-form-grid">
                            <div className="application-field">
                                <label htmlFor="company">Company *</label>
                                <input
                                    id="company"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    placeholder="e.g. Amazon"
                                    required
                                />
                            </div>

                            <div className="application-field">
                                <label htmlFor="jobTitle">Job title *</label>
                                <input
                                    id="jobTitle"
                                    name="jobTitle"
                                    value={form.jobTitle}
                                    onChange={handleChange}
                                    placeholder="e.g. React Developer"
                                    required
                                />
                            </div>

                            <div className="application-field">
                                <label htmlFor="jobType">Job type</label>
                                <select
                                    id="jobType"
                                    name="jobType"
                                    value={form.jobType}
                                    onChange={handleChange}
                                >
                                    {JOB_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="application-field">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    {STATUSES.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="application-field">
                                <label htmlFor="location">Location</label>
                                <input
                                    id="location"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Bangalore"
                                />
                            </div>

                            <div className="application-field">
                                <label htmlFor="jobUrl">Job URL</label>
                                <input
                                    id="jobUrl"
                                    name="jobUrl"
                                    type="url"
                                    value={form.jobUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/jobs"
                                />
                            </div>

                            <div className="application-field">
                                <label htmlFor="appliedDate">Applied date</label>
                                <input
                                    id="appliedDate"
                                    name="appliedDate"
                                    type="date"
                                    value={form.appliedDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="application-field">
                                <label htmlFor="interviewDate">
                                    Interview date
                                </label>
                                <input
                                    id="interviewDate"
                                    name="interviewDate"
                                    type="date"
                                    value={form.interviewDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="application-field">
                                <label htmlFor="salary">Salary</label>
                                <input
                                    id="salary"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. 12 LPA"
                                />
                            </div>

                            <div className="application-field application-field-full">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Interview preparation, job requirements..."
                                />
                            </div>
                        </div>

                        <button
                            className="application-primary-button"
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Save changes"
                                    : "Add application"}
                        </button>
                    </form>
                </section>

                <section className="application-list-card">
                    <div className="application-section-heading">
                        <div>
                            <h2>Your applications</h2>
                            <p>
                                Search, filter and manage your opportunities.
                            </p>
                        </div>
                    </div>

                    <div className="application-toolbar">
                        <form
                            className="application-search"
                            onSubmit={handleSearch}
                        >
                            <input
                                aria-label="Search applications"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                                placeholder="Search company or job title"
                            />

                            <button type="submit">Search</button>
                        </form>

                        <button
                            type="button"
                            className="application-secondary-button"
                            onClick={handleClearSearch}
                        >
                            Reset filters
                        </button>

                        <select
                            aria-label="Filter by application status"
                            value={status}
                            onChange={(event) => {
                                setStatus(event.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All statuses</option>

                            {STATUSES.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="application-empty-state">
                            Loading applications...
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="application-empty-state">
                            <span className="application-empty-icon">▤</span>
                            <h3>No applications found</h3>
                            <p>
                                Add an application or change your search
                                and filter settings.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="application-table-wrapper">
                                <table className="application-table">
                                    <thead>
                                        <tr>
                                            <th>Company / Role</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th>Applied date</th>
                                            <th>Interview date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {applications.map((application) => (
                                            <tr key={application._id}>
                                                <td>
                                                    <strong>
                                                        {application.company}
                                                    </strong>
                                                    <span className="application-job-title">
                                                        {application.jobTitle}
                                                    </span>
                                                </td>

                                                <td>
                                                    {application.location || "—"}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`application-status status-${application.status.toLowerCase()}`}
                                                    >
                                                        {application.status}
                                                    </span>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        application.appliedDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        application.interviewDate
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="application-row-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(application)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="application-delete-button"
                                                            onClick={() =>
                                                                handleDelete(application._id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="application-pagination">
                                <span>
                                    Page {pagination.currentPage || page}
                                    {" of "}
                                    {totalPages}
                                    {" · "}
                                    {pagination.totalApplications ?? 0}
                                    {" applications"}
                                </span>

                                <div>
                                    <button
                                        type="button"
                                        disabled={page <= 1 || loading}
                                        onClick={() =>
                                            setPage((previous) => previous - 1)
                                        }
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        disabled={page >= totalPages || loading}
                                        onClick={() =>
                                            setPage((previous) => previous + 1)
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </section>
        </main>
    );
}

export default Applications;