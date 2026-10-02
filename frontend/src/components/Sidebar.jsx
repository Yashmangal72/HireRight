import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FiGrid,
    FiFileText,
    FiBookmark,
    FiPlusSquare,
    FiBriefcase,
    FiUsers,
    FiUserCheck,
    FiUser,
    FiSettings,
    FiLogOut,
    FiSearch,
} from "react-icons/fi";

function Sidebar() {
    const { role, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const candidateLinks = [
        { to: "/jobs", label: "Jobs", icon: <FiSearch size={18} /> },
        { to: "/dashboard", label: "Dashboard", icon: <FiGrid size={18} /> },
        { to: "/applications", label: "My Applications", icon: <FiFileText size={18} /> },
        { to: "/saved-jobs", label: "Saved Jobs", icon: <FiBookmark size={18} /> },
    ];

    const recruiterLinks = [
        { to: "/jobs", label: "Jobs", icon: <FiSearch size={18} /> },
        { to: "/recruiter/overview", label: "Dashboard", icon: <FiGrid size={18} /> },
        { to: "/recruiter", label: "Post Job", icon: <FiPlusSquare size={18} /> },
        { to: "/my-jobs", label: "My Jobs", icon: <FiBriefcase size={18} /> },
        { to: "/recruiter/applications", label: "Applications", icon: <FiUsers size={18} /> },
        { to: "/recruiter/candidates", label: "Candidates", icon: <FiUserCheck size={18} /> },
    ];

    const links = role === "RECRUITER" ? recruiterLinks : candidateLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <Link to="/" className="sidebar-logo">
                    HireRight
                </Link>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={
                            "sidebar-link" +
                            (location.pathname === link.to ? " active" : "")
                        }
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <Link
                    to="/profile"
                    className={
                        "sidebar-link" +
                        (location.pathname === "/profile" ? " active" : "")
                    }
                >
                    <FiUser size={18} />
                    <span>Profile</span>
                </Link>

                <button
                    type="button"
                    className="sidebar-link sidebar-logout"
                    onClick={handleLogout}
                >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;