import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCandidateDashboard } from "../services/dashboardService";
import StatusStepper from "../components/StatusStepper";
import ResumeCard from "../components/ResumeCard";
import {
    FiFileText,
    FiCalendar,
    FiCheckCircle,
    FiMapPin,
    FiBookmark,
} from "react-icons/fi";

function CandidateDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const result = await getCandidateDashboard();
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
                <h1>Welcome back 👋</h1>
                <p>Here's an overview of your job search journey.</p>
            </div>

            <ResumeCard />

            <div className="stat-cards">
                <div className="stat-card">
                    <div className="stat-icon applications">
                        <FiFileText size={20} />
                    </div>
                    <div>
                        <span className="stat-number">
                            {data.applicationsCount}
                        </span>
                        <span className="stat-label">Applications</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon interviews">
                        <FiCalendar size={20} />
                    </div>
                    <div>
                        <span className="stat-number">
                            {data.interviewsCount}
                        </span>
                        <span className="stat-label">Interviews</span>
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

            <div className="stat-card">
                <div className="stat-icon saved">
                    <FiBookmark size={20} />
                </div>
                <div>
                    <span className="stat-number">
                        {data.savedJobsCount}
                    </span>
                    <span className="stat-label">Saved Jobs</span>
                </div>
            </div>

            <div className="dashboard-columns">

                <div className="dashboard-column">
                    <div className="dashboard-column-header">
                        <h2>Recent Applications</h2>
                        <Link to="/applications">View All</Link>
                    </div>

                    {data.recentApplications.length === 0 ? (
                        <p className="dashboard-empty">
                            You haven't applied to any jobs yet.
                        </p>
                    ) : (
                        <div className="dashboard-list">
                            {data.recentApplications.map((application) => (
                                <div
                                    className="dashboard-list-item"
                                    key={application.id}
                                >
                                    <div>
                                        <strong>
                                            {application.jobTitle}
                                        </strong>
                                        <p className="dashboard-item-meta">
                                            Applied{" "}
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

                <div className="dashboard-column">
                    <div className="dashboard-column-header">
                        <h2>Recommended Jobs</h2>
                        <Link to="/">View All</Link>
                    </div>

                    {data.recommendedJobs.length === 0 ? (
                        <p className="dashboard-empty">
                            No jobs available right now.
                        </p>
                    ) : (
                        <div className="dashboard-list">
                            {data.recommendedJobs.map((job) => (
                                <Link
                                    to={`/jobs/${job.id}`}
                                    className="dashboard-list-item"
                                    key={job.id}
                                >
                                    <div>
                                        <strong>{job.title}</strong>
                                        <p className="dashboard-item-meta">
                                            <FiMapPin size={12} />{" "}
                                            {job.location}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}

export default CandidateDashboard;