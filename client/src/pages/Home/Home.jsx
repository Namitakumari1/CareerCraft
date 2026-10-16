import { Link } from "react-router-dom";
import "../../App.css";

function Home() {
    return (
        <main className="app-shell">
            <header className="app-header">
                <Link className="brand" to="/">
                    <span className="brand-mark">C</span>
                    CareerCraft
                </Link>

                <nav className="hero-actions">
                    <Link className="secondary-action" to="/login">
                        Log in
                    </Link>
                    <Link className="primary-action" to="/register">
                        Get started ↗
                    </Link>
                </nav>
            </header>

            <section className="hero-section">
                <div className="hero-content">
                    <span className="eyebrow">
                        YOUR NEXT CHAPTER STARTS HERE
                    </span>

                    <h1>
                        Build your future.
                        <br />
                        <span>One opportunity at a time.</span>
                    </h1>

                    <p>
                        Create professional resumes, organize job
                        applications, and keep your career journey moving
                        forward — all in one place.
                    </p>

                    <div className="hero-actions">
                        <Link className="primary-action" to="/register">
                            Create your account ↗
                        </Link>
                        <Link className="secondary-action" to="/login">
                            I already have an account
                        </Link>
                    </div>

                    <div className="hero-trust">
                        <span>01 · Create</span>
                        <span>02 · Track</span>
                        <span>03 · Grow</span>
                    </div>
                </div>

                <div className="preview-card">
                    <div className="preview-topbar">
                        <div>
                            <span className="preview-caption">
                                YOUR CAREER WORKSPACE
                            </span>
                            <h2>Career overview</h2>
                        </div>
                        <span className="preview-icon">✦</span>
                    </div>

                    <div className="preview-stats">
                        <div className="stat-card">
                            <span>Resumes</span>
                            <strong>01</strong>
                            <small>Make your mark</small>
                        </div>
                        <div className="stat-card">
                            <span>Applications</span>
                            <strong>04</strong>
                            <small>Keep moving forward</small>
                        </div>
                    </div>

                    <div className="preview-progress">
                        <div className="progress-heading">
                            <span>Your next opportunity</span>
                            <span>In progress</span>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill" />
                        </div>
                        <p>A little progress every day adds up.</p>
                    </div>

                    <div className="preview-note">
                        <span className="note-symbol">✳</span>
                        <div>
                            <strong>Your journey. Your momentum.</strong>
                            <p>Everything you need, in one workspace.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="app-footer">
                <span>CAREERCRAFT</span>
                <span>Designed for your next chapter.</span>
            </footer>
        </main>
    );
}

export default Home;