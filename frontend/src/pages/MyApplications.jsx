import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMyApplications();
                setApplications(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load applications");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading applications...</h2>
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
        <div className="applications-page">

            <div className="page-heading">
                <h1>My Applications</h1>
                <p>Track the status of your job applications</p>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <h2>No Applications Yet</h2>
                    <p>
                        You haven't applied for any jobs yet.
                    </p>
                </div>
            ) : (
                <div className="applications-list">

                    {applications.map((application) => (
                        <div
                            className="application-card"
                            key={application.id}
                        >

                            <div className="application-header">

                                <div>
                                    <h2>
                                        {application.jobTitle}
                                    </h2>

                                    <p className="application-id">
                                        Application ID: #{application.id}
                                    </p>
                                </div>

                                <span
                                    className={`status-badge status-${application.status.toLowerCase()}`}
                                >
                                    {application.status}
                                </span>

                            </div>

                            <div className="application-divider"></div>

                            <div className="application-info">

                                <p>
                                    <strong>Applied On:</strong>{" "}
                                    {new Date(
                                        application.appliedAt
                                    ).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default MyApplications;