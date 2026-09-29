import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecruiterDashboard } from "../services/dashboardService";
import StatusStepper from "../components/StatusStepper";
import {
    FiBriefcase,
    FiUsers,
    FiStar,
    FiCheckCircle,
} from "react-icons/fi";

function RecruiterOverview() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const result = await getRecruiterDashboard();
                setData(result);
            } catch (error) {
                console.error(error);
                setError("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-center">
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <div className="page-heading">
                <h1>Recruiter Overview</h1>
                <p>Track your postings and candidate pipeline.</p>
            </div>

            <div className="stat-cards recruiter-stat-cards">
                <div className="stat-card">
                    <div className="stat-icon applications">
                        <FiBriefcase size={20} />
                    </div>
                    <div>
                        <span className="stat-number">
                            {data.jobsCount}
                        </span>
                        <span className="stat-label">Jobs Posted</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon interviews">
                        <FiUsers size={20} />
                    </div>
                    <div>
                        <span className="stat-number">
                            {data.applicationsCount}
                        </span>
                        <span className="stat-label">Applications</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon shortlisted">
                        <FiStar size={20} />
                    </div>
                    <div>
                        <span className="stat-number">
                            {data.shortlistedCount}
                        </span>
                        <span className="stat-label">Shortlisted</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon hired">
                        <FiCheckCircle size={20} />
                    </div>
                    <div>
                        <span className="stat-number">
                            {data.hiredCount}
                        </span>
                        <span className="stat-label">Hired</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-column">
                <div className="dashboard-column-header">
                    <h2>Recent Applications</h2>
                    <Link to="/recruiter/applications">View All</Link>
                </div>

                {data.recentApplications.length === 0 ? (
                    <p className="dashboard-empty">
                        No applications received yet.
                    </p>
                ) : (
                    <div className="dashboard-list">
                        {data.recentApplications.map((application) => (
                            <div
                                className="dashboard-list-item"
                                key={application.id}
                            >
                                <div>
                                    <strong>{application.jobTitle}</strong>
                                    <p className="dashboard-item-meta">
                                        {application.candidateName} · Applied{" "}
                                        {new Date(
                                            application.appliedAt
                                        ).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </p>
                                </div>

                                <StatusStepper
                                    status={application.status}
                                    compact
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default RecruiterOverview;