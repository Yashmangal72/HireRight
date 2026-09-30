import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

function AppLayout({ children }) {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="app-layout-main">
                <div className="app-layout-topbar">
                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={
                            darkMode ? "Switch to light theme" : "Switch to dark theme"
                        }
                    >
                        {darkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>

                <div className="app-layout-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AppLayout;