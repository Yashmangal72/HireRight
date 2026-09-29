import { useEffect, useState } from "react";
import {
    getAllApplications,
    updateApplicationStatus,
} from "../services/applicationService";
import { downloadCandidateResume } from "../services/resumeService";
import { FiDownload } from "react-icons/fi";

function RecruiterApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [resumeError, setResumeError] = useState("");

    const handleDownloadResume = async (application) => {
    setResumeError("");

    try {
        const blob = await downloadCandidateResume(application.id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${application.candidateName}-resume`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);

        if (error.response?.status === 404) {
            setResumeError(
                `${application.candidateName} hasn't uploaded a resume yet.`
            );
        } else {
            setResumeError("Failed to download resume.");
        }

        setTimeout(() => setResumeError(""), 4000);
    }
};

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getAllApplications();
                setApplications(data);
            } catch (error) {
                console.error(error);
                setError(
                    error.response?.data?.message ||
                    "Failed to load applications"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const updatedApplication =
                await updateApplicationStatus(id, status);

            setApplications((currentApplications) =>
                currentApplications.map((application) =>
                    application.id === id
                        ? updatedApplication
                        : application
                )
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update application status"
            );
        }
    };

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
        <div className="recruiter-applications-page">

            <div className="page-heading">
                <h1>Applications</h1>
                <p>Review candidates and manage application status</p>
            </div>

            {resumeError && (
                <p className="resume-toast-error">
                    {resumeError}
                </p>
            )}

            {applications.length === 0 ? (
                <div className="empty-state">
                    <h2>No Applications Yet</h2>
                    <p>
                        You haven't received any applications for your jobs.
                    </p>
                </div>
            ) : (
                <div className="recruiter-applications-list">

                    {applications.map((application) => (
                        <div
                            className="recruiter-application-card"
                            key={application.id}
                        >

                            <div className="recruiter-application-header">

                                <div>
                                    <h2>
                                        {application.jobTitle}
                                    </h2>

                                    <p className="application-id">
                                        Application #{application.id}
                                    </p>
                                </div>

                                <span
                                    className={`status-badge status-${application.status.toLowerCase()}`}
                                >
                                    {application.status}
                                </span>

                            </div>

                            <div className="application-divider"></div>

                            <div className="candidate-details">

                            <div className="candidate-detail">
                                <span className="detail-label">
                                    Candidate
                                </span>
                                <strong>
                                    {application.candidateName}
                                </strong>
                            </div>

                            <div className="candidate-detail">
                                <span className="detail-label">
                                    Email
                                </span>
                                <strong>
                                    {application.candidateEmail}
                                </strong>
                            </div>

                            <div className="candidate-detail">
                                <span className="detail-label">
                                    Applied On
                                </span>
                                <strong>
                                    {new Date(
                                        application.appliedAt
                                    ).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </strong>
                            </div>

                            <div className="candidate-detail">
                                <span className="detail-label">
                                    Resume
                                </span>
                                <button
                                    type="button"
                                    className="resume-download-link"
                                    onClick={() => handleDownloadResume(application)}
                                >
                                    <FiDownload size={13} /> Download
                                </button>
                            </div>

                        </div>

                            <div className="status-section">

                                <label htmlFor={`status-${application.id}`}>
                                    Update Status
                                </label>

                                <select
                                    id={`status-${application.id}`}
                                    value={application.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            application.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="APPLIED">
                                        APPLIED
                                    </option>

                                    <option value="SHORTLISTED">
                                        SHORTLISTED
                                    </option>

                                    <option value="INTERVIEW">
                                        INTERVIEW
                                    </option>

                                    <option value="HIRED">
                                        HIRED
                                    </option>

                                    <option value="REJECTED">
                                        REJECTED
                                    </option>
                                </select>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default RecruiterApplications;