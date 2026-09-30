import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";
import { getInterview } from "../services/interviewService";
import StatusStepper from "../components/StatusStepper";
import { FiCalendar, FiClock, FiLink, FiMessageSquare } from "react-icons/fi";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [interviews, setInterviews] = useState({});

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMyApplications();
                setApplications(data);

                const interviewCandidates = data.filter((application) =>
                    ["INTERVIEW", "HIRED", "REJECTED"].includes(
                        application.status
                    )
                );

                const results = await Promise.allSettled(
                    interviewCandidates.map((application) =>
                        getInterview(application.id).then((interview) => ({
                            id: application.id,
                            interview,
                        }))
                    )
                );

                const interviewMap = {};

                results.forEach((result) => {
                    if (result.status === "fulfilled") {
                        interviewMap[result.value.id] = result.value.interview;
                    }
                });

                setInterviews(interviewMap);
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
                            </div>

                            <div className="application-divider"></div>

                            <StatusStepper status={application.status} />

                            {interviews[application.id] && (
                                <div className="interview-details">
                                    <div className="interview-details-header">
                                        <FiCalendar size={16} />
                                        <span>Interview Scheduled</span>
                                    </div>

                                    <div className="interview-details-grid">
                                        <div className="interview-detail-item">
                                            <FiClock size={13} />
                                            <span>
                                                {new Date(
                                                    interviews[application.id].scheduledAt
                                                ).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <div className="interview-detail-item">
                                            <span className="interview-type-tag">
                                                {interviews[application.id].interviewType}
                                            </span>
                                            {interviews[application.id].durationMinutes && (
                                                <span>
                                                    {interviews[application.id].durationMinutes} min
                                                </span>
                                            )}
                                        </div>

                                        {interviews[application.id].meetingLink && (
                                            <div className="interview-detail-item">
                                                <FiLink size={13} />
                                                <a
                                                    href={interviews[application.id].meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Join Meeting
                                                </a>
                                            </div>
                                        )}

                                        {interviews[application.id].notes && (
                                            <div className="interview-detail-item full-width">
                                                <FiMessageSquare size={13} />
                                                <span>{interviews[application.id].notes}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

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