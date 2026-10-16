
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const message = location.state?.message;

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            setLoading(true);

            // Calls POST /api/auth/login and saves the JWT
            await authApi.login(form);

            navigate("/dashboard", { replace: true });
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

                <p className="auth-eyebrow">WELCOME BACK</p>
                <h1>Log in to CareerCraft</h1>

                <p className="auth-description">
                    Continue building your career, one step at a time.
                </p>

                {message && <p className="auth-success">{message}</p>}

                <form onSubmit={handleSubmit}>
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
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                    />

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="auth-switch">
                    New to CareerCraft? <Link to="/register">Create an account</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;