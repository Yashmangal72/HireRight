import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteJob, getMyJobs } from "../services/recruiterService";

function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchJobs = async () => {
        try {
            setError("");
            const data = await getMyJobs();
            setJobs(data);
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message || "Failed to load your jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        try {
            await deleteJob(id);

            setJobs((currentJobs) =>
                currentJobs.filter((job) => job.id !== id)
            );
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete job"
            );
        }
    };

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading your jobs...</h2>
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
        <div className="my-jobs-page">
            <div className="page-heading">
                <div>
                    <h1>My Jobs</h1>
                    <p>Manage the jobs you have posted.</p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => navigate("/recruiter")}
                >
                    + Post New Job
                </button>
            </div>

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <h2>No jobs posted yet</h2>
                    <p>
                        Create your first job posting to start receiving
                        applications.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/recruiter")}
                    >
                        Post a Job
                    </button>
                </div>
            ) : (
                <div className="my-jobs-list">
                    {jobs.map((job) => (
                        <div className="my-job-card" key={job.id}>
                            <div className="my-job-content">
                                <div className="my-job-header">
                                    <div>
                                        <h2>{job.title}</h2>
                                        <p className="job-location">
                                            📍 {job.location}
                                        </p>
                                    </div>

                                    <span className="job-id">
                                        #{job.id}
                                    </span>
                                </div>

                                <p className="job-description">
                                    {job.description}
                                </p>

                                <div className="job-meta">
                                    <span className="job-meta-item">
                                        💰 ₹{job.salary}
                                    </span>

                                    <span className="job-meta-item">
                                        💼 {job.employmentType}
                                    </span>

                                    <span className="job-meta-item">
                                        📊 {job.experienceLevel}
                                    </span>
                                </div>
                            </div>

                            <div className="my-job-actions">
                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        navigate(`/edit-job/${job.id}`)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="danger-button"
                                    onClick={() => handleDelete(job.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyJobs;