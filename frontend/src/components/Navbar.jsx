import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

function Navbar() {
    const { logout, isAuthenticated, role } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-logo">
                    HireRight
                </Link>

                <div className="navbar-links">

                    <Link to="/" className="navbar-link">
                        Jobs
                    </Link>

                    {isAuthenticated && role === "CANDIDATE" && (
                        <Link
                            to="/applications"
                            className="navbar-link"
                        >
                            My Applications
                        </Link>
                    )}

                    {isAuthenticated && role === "RECRUITER" && (
                        <>
                            <Link
                                to="/recruiter"
                                className="navbar-link"
                            >
                                Post Job
                            </Link>

                            <Link
                                to="/my-jobs"
                                className="navbar-link"
                            >
                                My Jobs
                            </Link>

                            <Link
                                to="/recruiter/applications"
                                className="navbar-link"
                            >
                                Applications
                            </Link>
                        </>
                    )}

                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="navbar-button"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="navbar-button navbar-register"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <button
                            className="navbar-button navbar-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}

                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
                        title={darkMode ? "Light theme" : "Dark theme"}
                    >
                        {darkMode ? <FiSun /> : <FiMoon />}
                    </button>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;