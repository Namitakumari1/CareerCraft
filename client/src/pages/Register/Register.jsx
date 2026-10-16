
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            await authApi.register(form);
            navigate("/login", {
                replace: true,
                state: { message: "Account created! Please log in." },
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <Link className="auth-brand" to="/">
                    <span className="brand-mark">C</span>
                    CareerCraft
                </Link>

                <p className="auth-eyebrow">START YOUR JOURNEY</p>
                <h1>Create your account</h1>
                <p className="auth-description">
                    Build your resume and organize your career opportunities.
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Full name</label>
                    <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                    />

                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already registered? <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    );
}

export default Register;