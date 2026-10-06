import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyInterviews } from "../services/interviewService";
import {
    FiCalendar,
    FiClock,
    FiLink,
    FiMessageSquare,
} from "react-icons/fi";

function isPast(dateString) {
    return new Date(dateString).getTime() < Date.now();
}

function RecruiterInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const data = await getMyInterviews();
                setInterviews(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load interviews");
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading interviews...</h2>
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

    const upcoming = interviews.filter((i) => !isPast(i.scheduledAt));
    const past = interviews.filter((i) => isPast(i.scheduledAt));

    const renderCard = (interview) => (
        <div
            className={
                "interview-list-card" + (isPast(interview.scheduledAt) ? " past" : "")
            }
            key={interview.id}
        >
            <div className="interview-list-header">
                <div>
                    <h2>{interview.candidateName}</h2>
                    <p className="application-id">{interview.jobTitle}</p>
                </div>
                <span className="interview-type-tag">
                    {interview.interviewType}
                </span>
            </div>

            <div className="interview-details-grid" style={{ marginTop: "0.75rem" }}>
                <div className="interview-detail-item">
                    <FiClock size={13} />
                    <span>
                        {new Date(interview.scheduledAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                    {interview.durationMinutes && (
                        <span>· {interview.durationMinutes} min</span>
                    )}
                </div>

                {interview.meetingLink && (
                    <div className="interview-detail-item">
                        <FiLink size={13} />
                        <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Join Meeting
                        </a>
                    </div>
                )}

                {interview.notes && (
                    <div className="interview-detail-item full-width">
                        <FiMessageSquare size={13} />
                        <span>{interview.notes}</span>
                    </div>
                )}
            </div>

            <Link
                to="/recruiter/applications"
                className="candidate-view-link"
                style={{ marginTop: "0.875rem", display: "inline-block" }}
            >
                View Application
            </Link>
        </div>
    );

    return (
        <div className="recruiter-interviews-page">

            <div className="page-heading">
                <h1>Interviews</h1>
                <p>All interviews scheduled across your job postings</p>
            </div>

            {interviews.length === 0 ? (
                <div className="empty-state">
                    <h2>No Interviews Scheduled</h2>
                    <p>
                        Schedule an interview from the Applications page and it
                        will show up here.
                    </p>
                </div>
            ) : (
                <>
                    <div className="interviews-section">
                        <h2 className="interviews-section-title">
                            <FiCalendar size={16} /> Upcoming ({upcoming.length})
                        </h2>

                        {upcoming.length === 0 ? (
                            <p className="dashboard-empty">
                                No upcoming interviews.
                            </p>
                        ) : (
                            <div className="interviews-list">
                                {upcoming.map(renderCard)}
                            </div>
                        )}
                    </div>

                    {past.length > 0 && (
                        <div className="interviews-section">
                            <h2 className="interviews-section-title">
                                Past ({past.length})
                            </h2>

                            <div className="interviews-list">
                                {past.map(renderCard)}
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}

export default RecruiterInterviews;