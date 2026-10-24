
import { NavLink, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        authApi.logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="cc-navbar">
            <NavLink className="cc-brand" to="/dashboard">
                <span className="cc-brand-mark">C</span>
                <span>CareerCraft</span>
            </NavLink>

            <nav className="cc-nav-links" aria-label="Main navigation">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `cc-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/resume-builder"
                    className={({ isActive }) =>
                        `cc-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Resume Builder
                </NavLink>

                <NavLink
                    to="/applications"
                    className={({ isActive }) =>
                        `cc-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Applications
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `cc-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Profile
                </NavLink>

                <button
                    type="button"
                    className="cc-logout-button"
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </nav>
        </header>
    );
}

export default Navbar;