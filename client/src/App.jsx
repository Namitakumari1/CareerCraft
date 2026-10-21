import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Applications from "./pages/Applications/Applications.jsx";
import { BrowserRouter, Navigate, Route, Routes, Link, } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import { authApi } from "./services/api";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

function DashboardPlaceholder() {
  const handleLogout = () => {
    authApi.logout();
    window.location.replace("/login");
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/">
          <span className="brand-mark">C</span>
          CareerCraft
        </Link>

        <button
          type="button"
          className="secondary-action"
          onClick={handleLogout}
        >
          Log out
        </button>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h1>
            Welcome to
            <br />
            <span>CareerCraft.</span>
          </h1>
          <p>
            You are logged in. Your protected dashboard route is
            working. Next, we'll replace this placeholder with
            your real dashboard analytics.
          </p>

          <div className="hero-actions">
            <Link
              className="primary-action"
              to="/resume-builder"
            >
              Resume Builder ↗
            </Link>

            <Link
              className="secondary-action"
              to="/applications"
            >
              Job Applications
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ComingSoon({ title }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-brand" to="/dashboard">
          <span className="brand-mark">C</span>
          CareerCraft
        </Link>

        <h1>{title}</h1>
        <p className="auth-description">
          This page will be connected to your backend in the next
          development step.
        </p>

        <Link className="primary-action" to="/dashboard">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-builder" element={<ComingSoon title="Resume Builder" />}          />
          <Route path="/applications" element={<Applications />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;