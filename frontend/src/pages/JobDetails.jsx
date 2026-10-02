import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { applyForJob } from "../services/applicationService";
import { FiMapPin, FiDollarSign, FiBriefcase, FiBarChart2 } from "react-icons/fi";


function JobDetails() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applyMessage, setApplyMessage] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    const handleApply = async () => {
        setApplyMessage("");

        try {
            const data = await applyForJob(job.id, coverLetter);

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
                        <FiMapPin size={15} /> {job.location}
                    </p>
                    </div>

                    <div className="job-details-meta">
                        <span className="salary"><FiDollarSign size={14} /> ₹{job.salary}</span>
                        <span><FiBriefcase size={14} /> {job.employmentType}</span>
                        <span><FiBarChart2 size={14} /> {job.experienceLevel}</span>
                    </div>

                <div className="job-details-divider"></div>

                    <div className="job-tabs">
                        <button
                            type="button"
                            className={"job-tab" + (activeTab === "overview" ? " active" : "")}
                            onClick={() => setActiveTab("overview")}
                        >
                            Overview
                        </button>

                        {job.requirements && (
                            <button
                                type="button"
                                className={"job-tab" + (activeTab === "requirements" ? " active" : "")}
                                onClick={() => setActiveTab("requirements")}
                            >
                                Requirements
                            </button>
                        )}

                        {job.responsibilities && (
                            <button
                                type="button"
                                className={"job-tab" + (activeTab === "responsibilities" ? " active" : "")}
                                onClick={() => setActiveTab("responsibilities")}
                            >
                                Responsibilities
                            </button>
                        )}

                        {job.benefits && (
                            <button
                                type="button"
                                className={"job-tab" + (activeTab === "benefits" ? " active" : "")}
                                onClick={() => setActiveTab("benefits")}
                            >
                                Benefits
                            </button>
                        )}

                        {(job.companyName || job.companyWebsite) && (
                            <button
                                type="button"
                                className={"job-tab" + (activeTab === "company" ? " active" : "")}
                                onClick={() => setActiveTab("company")}
                            >
                                About Company
                            </button>
                        )}
                    </div>

                    <div className="job-tab-content">
                        {activeTab === "overview" && (
                            <section>
                                <h2>Job Description</h2>
                                <p>{job.description}</p>
                            </section>
                        )}

                        {activeTab === "requirements" && (
                            <section>
                                <h2>Requirements</h2>
                                <p>{job.requirements}</p>
                            </section>
                        )}

                        {activeTab === "responsibilities" && (
                            <section>
                                <h2>Responsibilities</h2>
                                <p>{job.responsibilities}</p>
                            </section>
                        )}

                        {activeTab === "benefits" && (
                            <section>
                                <h2>Benefits</h2>
                                <p>{job.benefits}</p>
                            </section>
                        )}

                        {activeTab === "company" && (
                            <section>
                                <h2>About {job.companyName || "the Company"}</h2>
                                {job.companyWebsite && (
                                    <p>
                                        <a
                                            href={job.companyWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="job-company-link"
                                        >
                                            {job.companyWebsite}
                                        </a>
                                    </p>
                                )}
                            </section>
                        )}
                    </div>

                <div className="job-apply-section">

                    <div className="cover-letter-group">
                        <label htmlFor="coverLetter">
                            Cover Letter <span className="optional-tag">(optional)</span>
                        </label>

                        <textarea
                            id="coverLetter"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Tell the recruiter why you're a good fit for this role..."
                            rows="5"
                            maxLength={2000}
                        />

                        <span className="char-count">
                            {coverLetter.length}/2000
                        </span>
                    </div>

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