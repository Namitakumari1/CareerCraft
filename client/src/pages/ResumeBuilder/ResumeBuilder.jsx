
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resumeApi, authApi } from "../../services/api";
import "./ResumeBuilder.css";

const createEmptyResume = () => ({
    title: "",
    template: "modern",
    personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedIn: "",
        portfolio: "",
    },
    professionalSummary: "",
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
});

function ResumeBuilder() {
    const [form, setForm] = useState(createEmptyResume);
    const [resumes, setResumes] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [skillsInput, setSkillsInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const loadResumes = async () => {
        const data = await resumeApi.getAll();
        setResumes(data.resumes || []);
    };

    useEffect(() => {
        let active = true;

        const initialize = async () => {
            try {
                const data = await resumeApi.getAll();

                if (active) {
                    setResumes(data.resumes || []);
                }
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        };

        initialize();

        return () => {
            active = false;
        };
    }, []);

    const updateField = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const updatePersonalInfo = (field, value) => {
        setForm((previous) => ({
            ...previous,
            personalInfo: {
                ...previous.personalInfo,
                [field]: value,
            },
        }));
    };

    const updateArrayItem = (section, index, field, value) => {
        setForm((previous) => ({
            ...previous,
            [section]: previous[section].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const addItem = (section, item) => {
        setForm((previous) => ({
            ...previous,
            [section]: [...previous[section], item],
        }));
    };

    const removeItem = (section, index) => {
        setForm((previous) => ({
            ...previous,
            [section]: previous[section].filter(
                (_, i) => i !== index
            ),
        }));
    };

    const resetForm = () => {
        setForm(createEmptyResume());
        setSelectedId("");
        setSkillsInput("");
        setError("");
        setNotice("");
    };

    const handleSelectResume = async (id) => {
        if (!id) {
            resetForm();
            return;
        }

        try {
            setError("");
            setNotice("");

            const data = await resumeApi.getById(id);
            const resume = data.resume;

            setForm({
                ...createEmptyResume(),
                ...resume,
                personalInfo: {
                    ...createEmptyResume().personalInfo,
                    ...resume.personalInfo,
                },
            });

            setSkillsInput((resume.skills || []).join(", "));
            setSelectedId(resume._id);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");

        if (!form.title.trim()) {
            setError("Please enter a resume title.");
            return;
        }

        const payload = {
            ...form,
            title: form.title.trim(),
            skills: skillsInput
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
        };

        try {
            setSaving(true);

            if (selectedId) {
                await resumeApi.update(selectedId, payload);
                setNotice("Resume updated successfully.");
            } else {
                const data = await resumeApi.create(payload);
                setSelectedId(data.resume._id);
                setNotice("Resume created successfully.");
            }

            await loadResumes();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmed) return;

        try {
            setError("");
            await resumeApi.remove(selectedId);
            resetForm();
            await loadResumes();
            setNotice("Resume deleted successfully.");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        authApi.logout();
        window.location.replace("/login");
    };

    if (loading) {
        return (
            <main className="resume-page">
                <p className="resume-message">Loading your resumes...</p>
            </main>
        );
    }

    return (
        <main className="resume-page">
            <header className="resume-header">
                <Link className="resume-brand" to="/dashboard">
                    <span className="brand-mark">C</span>
                    CareerCraft
                </Link>

                <nav className="resume-nav">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/applications">Applications</Link>
                    <button onClick={handleLogout}>Log out</button>
                </nav>
            </header>

            <section className="resume-content">
                <div className="resume-heading">
                    <div>
                        <p className="resume-eyebrow">
                            YOUR PROFESSIONAL PROFILE
                        </p>
                        <h1>Resume Builder</h1>
                        <p>
                            Create, edit and organize your professional resumes.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="resume-secondary-button"
                        onClick={resetForm}
                    >
                        + New resume
                    </button>
                </div>

                {error && (
                    <p className="resume-error" role="alert">{error}</p>
                )}

                {notice && (
                    <p className="resume-success" role="status">{notice}</p>
                )}

                <section className="resume-card resume-library">
                    <label htmlFor="saved-resumes">Your saved resumes</label>

                    <select
                        id="saved-resumes"
                        value={selectedId}
                        onChange={(event) =>
                            handleSelectResume(event.target.value)
                        }
                    >
                        <option value="">Create a new resume</option>
                        {resumes.map((resume) => (
                            <option key={resume._id} value={resume._id}>
                                {resume.title}
                            </option>
                        ))}
                    </select>
                </section>

                <div className="resume-layout">
                    <form className="resume-card resume-form" onSubmit={handleSave}>
                        <h2>Resume details</h2>

                        <label htmlFor="resume-title">Resume title *</label>
                        <input
                            id="resume-title"
                            value={form.title}
                            onChange={(event) =>
                                updateField("title", event.target.value)
                            }
                            placeholder="e.g. Frontend Developer Resume"
                            maxLength={100}
                            required
                        />

                        <label htmlFor="resume-template">Resume template</label>
                        <select
                            id="resume-template"
                            value={form.template}
                            onChange={(event) =>
                                updateField("template", event.target.value)
                            }
                        >
                            <option value="modern">Modern</option>
                            <option value="professional">Professional</option>
                            <option value="minimal">Minimal</option>
                        </select>

                        <h3>Personal information</h3>

                        {[
                            ["fullName", "Full name"],
                            ["email", "Email address"],
                            ["phone", "Phone number"],
                            ["location", "Location"],
                            ["linkedIn", "LinkedIn URL"],
                            ["portfolio", "Portfolio URL"],
                        ].map(([field, label]) => (
                            <label className="resume-field" key={field}>
                                {label}
                                <input
                                    type={field === "email" ? "email" : "text"}
                                    value={form.personalInfo[field]}
                                    onChange={(event) =>
                                        updatePersonalInfo(field, event.target.value)
                                    }
                                    placeholder={label}
                                />
                            </label>
                        ))}

                        <h3>Professional summary</h3>
                        <textarea
                            rows={4}
                            maxLength={2000}
                            value={form.professionalSummary}
                            onChange={(event) =>
                                updateField("professionalSummary", event.target.value)
                            }
                            placeholder="Briefly describe your experience, strengths and career goals."
                        />

                        <h3>Education</h3>

                        {form.education.map((item, index) => (
                            <div className="resume-entry" key={item._id || index}>
                                {[
                                    ["institution", "Institution"],
                                    ["degree", "Degree"],
                                    ["fieldOfStudy", "Field of study"],
                                    ["startDate", "Start date"],
                                    ["endDate", "End date"],
                                    ["grade", "Grade"],
                                ].map(([field, label]) => (
                                    <label className="resume-field" key={field}>
                                        {label}
                                        <input
                                            value={item[field] || ""}
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    "education", index, field,
                                                    event.target.value
                                                )
                                            }
                                            placeholder={label}
                                        />
                                    </label>
                                ))}

                                <label className="resume-field">
                                    Description
                                    <textarea
                                        value={item.description || ""}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "education", index, "description",
                                                event.target.value
                                            )
                                        }
                                        rows={2}
                                    />
                                </label>

                                <button
                                    type="button"
                                    className="resume-remove-button"
                                    onClick={() => removeItem("education", index)}
                                >
                                    Remove education
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="resume-secondary-button"
                            onClick={() => addItem("education", {
                                institution: "",
                                degree: "",
                                fieldOfStudy: "",
                                startDate: "",
                                endDate: "",
                                grade: "",
                                description: "",
                            })}
                        >
                            + Add education
                        </button>

                        <h3>Experience</h3>

                        {form.experience.map((item, index) => (
                            <div className="resume-entry" key={item._id || index}>
                                {[
                                    ["company", "Company"],
                                    ["position", "Job title"],
                                    ["startDate", "Start date"],
                                    ["endDate", "End date"],
                                ].map(([field, label]) => (
                                    <label className="resume-field" key={field}>
                                        {label}
                                        <input
                                            value={item[field] || ""}
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    "experience", index, field,
                                                    event.target.value
                                                )
                                            }
                                            placeholder={label}
                                        />
                                    </label>
                                ))}

                                <label className="resume-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(item.currentlyWorking)}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "experience", index,
                                                "currentlyWorking",
                                                event.target.checked
                                            )
                                        }
                                    />
                                    I currently work here
                                </label>

                                <label className="resume-field">
                                    Description
                                    <textarea
                                        rows={3}
                                        value={item.description || ""}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "experience", index, "description",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <button
                                    type="button"
                                    className="resume-remove-button"
                                    onClick={() => removeItem("experience", index)}
                                >
                                    Remove experience
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="resume-secondary-button"
                            onClick={() => addItem("experience", {
                                company: "",
                                position: "",
                                startDate: "",
                                endDate: "",
                                currentlyWorking: false,
                                description: "",
                            })}
                        >
                            + Add experience
                        </button>

                        <h3>Skills</h3>
                        <label className="resume-field">
                            Skills (separate with commas)
                            <input
                                value={skillsInput}
                                onChange={(event) =>
                                    setSkillsInput(event.target.value)
                                }
                                placeholder="React, JavaScript, Node.js, MongoDB"
                            />
                        </label>

                        <h3>Projects</h3>

                        {form.projects.map((item, index) => (
                            <div className="resume-entry" key={item._id || index}>
                                <label className="resume-field">
                                    Project title
                                    <input
                                        value={item.title || ""}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "projects", index, "title",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <label className="resume-field">
                                    Description
                                    <textarea
                                        rows={3}
                                        value={item.description || ""}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "projects", index, "description",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <label className="resume-field">
                                    Technologies (separate with commas)
                                    <input
                                        value={(item.technologies || []).join(", ")}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "projects", index, "technologies",
                                                event.target.value.split(",")
                                                    .map((value) => value.trim())
                                                    .filter(Boolean)
                                            )
                                        }
                                    />
                                </label>

                                <label className="resume-field">
                                    Project URL
                                    <input
                                        value={item.projectUrl || ""}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "projects", index, "projectUrl",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <button
                                    type="button"
                                    className="resume-remove-button"
                                    onClick={() => removeItem("projects", index)}
                                >
                                    Remove project
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="resume-secondary-button"
                            onClick={() => addItem("projects", {
                                title: "",
                                description: "",
                                technologies: [],
                                projectUrl: "",
                            })}
                        >
                            + Add project
                        </button>

                        <h3>Certifications</h3>

                        {form.certifications.map((item, index) => (
                            <div className="resume-entry" key={item._id || index}>
                                {[
                                    ["name", "Certification name"],
                                    ["issuer", "Issuing organization"],
                                    ["issueDate", "Issue date"],
                                    ["credentialUrl", "Credential URL"],
                                ].map(([field, label]) => (
                                    <label className="resume-field" key={field}>
                                        {label}
                                        <input
                                            value={item[field] || ""}
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    "certifications", index, field,
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </label>
                                ))}

                                <button
                                    type="button"
                                    className="resume-remove-button"
                                    onClick={() =>
                                        removeItem("certifications", index)
                                    }
                                >
                                    Remove certification
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="resume-secondary-button"
                            onClick={() => addItem("certifications", {
                                name: "",
                                issuer: "",
                                issueDate: "",
                                credentialUrl: "",
                            })}
                        >
                            + Add certification
                        </button>

                        <h3>Achievements</h3>
                        <label className="resume-field">
                            Achievements (one per line)
                            <textarea
                                rows={4}
                                value={form.achievements.join("\n")}
                                onChange={(event) =>
                                    updateField(
                                        "achievements",
                                        event.target.value.split("\n")
                                            .map((value) => value.trim())
                                            .filter(Boolean)
                                    )
                                }
                                placeholder={"Hackathon finalist\nSolved 200 coding problems"}
                            />
                        </label>

                        <div className="resume-form-actions">
                            <button
                                type="submit"
                                className="resume-primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : selectedId
                                        ? "Update resume"
                                        : "Save resume"}
                            </button>

                            {selectedId && (
                                <button
                                    type="button"
                                    className="resume-remove-button"
                                    onClick={handleDelete}
                                >
                                    Delete resume
                                </button>
                            )}
                        </div>
                    </form>

                    <aside className={`resume-card resume-preview template-${form.template}`}>
                        <div className="resume-preview-heading">
                            <h2>Live preview</h2>
                            <span>{form.template}</span>
                        </div>

                        <article className="resume-paper">
                            <h1>
                                {form.personalInfo.fullName || "Your Name"}
                            </h1>

                            <p className="resume-preview-contact">
                                {[
                                    form.personalInfo.email,
                                    form.personalInfo.phone,
                                    form.personalInfo.location,
                                ].filter(Boolean).join(" · ")}
                            </p>

                            <p className="resume-preview-contact">
                                {[
                                    form.personalInfo.linkedIn,
                                    form.personalInfo.portfolio,
                                ].filter(Boolean).join(" · ")}
                            </p>

                            {form.professionalSummary && (
                                <section>
                                    <h3>Professional Summary</h3>
                                    <p>{form.professionalSummary}</p>
                                </section>
                            )}

                            {form.experience.length > 0 && (
                                <section>
                                    <h3>Experience</h3>
                                    {form.experience.map((item, index) => (
                                        <div key={item._id || index}>
                                            <strong>{item.position || "Job title"}</strong>
                                            <p>{item.company}</p>
                                            <small>
                                                {item.startDate} – {
                                                    item.currentlyWorking
                                                        ? "Present"
                                                        : item.endDate
                                                }
                                            </small>
                                            <p>{item.description}</p>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {form.education.length > 0 && (
                                <section>
                                    <h3>Education</h3>
                                    {form.education.map((item, index) => (
                                        <div key={item._id || index}>
                                            <strong>{item.degree || "Degree"}</strong>
                                            <p>{item.institution}</p>
                                            <p>{item.fieldOfStudy}</p>
                                            <small>
                                                {item.startDate} – {item.endDate}
                                            </small>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {skillsInput.trim() && (
                                <section>
                                    <h3>Skills</h3>
                                    <p>{skillsInput}</p>
                                </section>
                            )}

                            {form.projects.length > 0 && (
                                <section>
                                    <h3>Projects</h3>
                                    {form.projects.map((item, index) => (
                                        <div key={item._id || index}>
                                            <strong>{item.title || "Project title"}</strong>
                                            <p>{item.description}</p>
                                            <small>
                                                {(item.technologies || []).join(", ")}
                                            </small>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {form.certifications.length > 0 && (
                                <section>
                                    <h3>Certifications</h3>
                                    {form.certifications.map((item, index) => (
                                        <p key={item._id || index}>
                                            <strong>{item.name}</strong>
                                            {item.issuer && ` — ${item.issuer}`}
                                        </p>
                                    ))}
                                </section>
                            )}

                            {form.achievements.length > 0 && (
                                <section>
                                    <h3>Achievements</h3>
                                    <ul>
                                        {form.achievements.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </article>

                        <button
                            type="button"
                            className="resume-secondary-button resume-print-button"
                            onClick={() => window.print()}
                        >
                            Print / Save as PDF
                        </button>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export default ResumeBuilder;