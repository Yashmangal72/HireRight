import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { applyForJob } from "../services/applicationService";

function JobDetails() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applyMessage, setApplyMessage] = useState("");

    const handleApply = async () => {
        setApplyMessage("");

        try {
            const data = await applyForJob(job.id);

            console.log("Application:", data);
            setApplyMessage("Application submitted successfully!");
        } catch (error) {
            console.error(error);

            setApplyMessage(
                error.response?.data?.message ||
                "Failed to apply for job"
            );
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(id);
                setJob(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load job");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading job...</h2>
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
        <div className="job-details-page">

            <div className="job-details-card">

                <div className="job-details-header">
                    <h1>{job.title}</h1>

                    <p className="job-details-location">
                        📍 {job.location}
                    </p>
                </div>

                <div className="job-details-meta">

                    <span>
                        💰 ₹{job.salary}
                    </span>

                    <span>
                        💼 {job.employmentType}
                    </span>

                    <span>
                        📊 {job.experienceLevel}
                    </span>

                </div>

                <div className="job-details-divider"></div>

                <section className="job-description-section">
                    <h2>Job Description</h2>

                    <p>{job.description}</p>
                </section>

                <div className="job-apply-section">

                    <button
                        className="apply-button"
                        onClick={handleApply}
                    >
                        Apply for Job
                    </button>

                    {applyMessage && (
                        <p
                            className={
                                applyMessage.includes("successfully")
                                    ? "apply-message success"
                                    : "apply-message error"
                            }
                        >
                            {applyMessage}
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default JobDetails;