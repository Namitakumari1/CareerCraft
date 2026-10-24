
import { useEffect, useState } from "react";
import { authApi } from "../../services/api";
import "./Profile.css";
import Navbar from "../../components/Navbar.jsx";

function Profile() {
    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await authApi.getMe();
                setForm({
                    name: data.user.name || "",
                    email: data.user.email || "",
                });
            } catch (err) {
                setError(err.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        if (!form.name.trim() || !form.email.trim()) {
            setError("Name and email are required.");
            return;
        }

        setSaving(true);

        try {
            const data = await authApi.updateMe({
                name: form.name.trim(),
                email: form.email.trim(),
            });

            setForm({
                name: data.user.name,
                email: data.user.email,
            });

            setMessage("Profile updated successfully.");
        } catch (err) {
            setError(err.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="profile-page">Loading profile...</div>
            </>
        );
    }

    return (
        <>
        
        <Navbar />

        <main className="profile-page">
            <section className="profile-card">
                <h1>My Profile</h1>
                <p className="profile-subtitle">
                    View and update your account details.
                </p>

                {message && (
                    <p className="profile-message" role="status">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="profile-error" role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="profile-name">Full name</label>
                    <input
                        id="profile-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="profile-email">Email address</label>
                    <input
                        id="profile-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </section>
        </main>
        </>
    );
}

export default Profile;