import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { applyForJob } from "../services/applicationService";
import { saveJob, unsaveJob, getSavedJobStatus } from "../services/savedJobService";
import { useAuth } from "../context/AuthContext";
import {
    FiArrowLeft,
    FiMapPin,
    FiBriefcase,
    FiBarChart2,
    FiDollarSign,
    FiBookmark,
    FiGlobe,
    FiClock,
} from "react-icons/fi";

const LOGO_COLORS = ["#4f46e5", "#0d9488", "#db2777", "#d97706", "#0891b2", "#65a30d"];

function getLogoColor(id) {
    return LOGO_COLORS[id % LOGO_COLORS.length];
}

function timeAgo(dateString) {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Posted today";
    if (days === 1) return "Posted 1 day ago";
    if (days < 7) return `Posted ${days} days ago`;

    const weeks = Math.floor(days / 7);
    if (weeks === 1) return "Posted 1 week ago";
    return `Posted ${weeks} weeks ago`;
}

function BulletList({ text }) {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length === 0) return null;

    return (
        <ul className="job-bullet-list">
            {lines.map((line, index) => (
                <li key={index}>{line}</li>
            ))}
        </ul>
    );
}

function JobDetails() {
    const { id } = useParams();
    const { isAuthenticated, role } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applyMessage, setApplyMessage] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [saved, setSaved] = useState(false);

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

    useEffect(() => {
        if (isAuthenticated && role === "CANDIDATE") {
            getSavedJobStatus(id)
                .then((data) => setSaved(data.saved))
                .catch((error) => console.error(error));
        }
    }, [id, isAuthenticated, role]);

    const handleToggleSave = async () => {
        try {
            if (saved) {
                await unsaveJob(id);
                setSaved(false);
            } else {
                await saveJob(id);
                setSaved(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleApply = async () => {
        setApplyMessage("");

        try {
            const data = await applyForJob(job.id, coverLetter);
            console.log("Application:", data);
            setApplyMessage("Application submitted successfully!");
        } catch (error) {
            console.error(error);
            setApplyMessage(
                error.response?.data?.message || "Failed to apply for job"
            );
        }
    };

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

    const tabs = [
        { key: "overview", label: "Overview", content: job.description },
        { key: "requirements", label: "Requirements", content: job.requirements },
        { key: "responsibilities", label: "Responsibilities", content: job.responsibilities },
        { key: "benefits", label: "Benefits", content: job.benefits },
    ].filter((tab) => tab.key === "overview" || tab.content);

    return (
        <div className="job-details-page-v2">

            <Link to="/jobs" className="back-to-jobs">
                <FiArrowLeft size={15} /> Back to Jobs
            </Link>

            <div className="job-details-header-card">
                <div className="job-details-header-main">
                    <div
                        className="job-logo job-logo-lg"
                        style={{ backgroundColor: getLogoColor(job.id) }}
                    >
                        {(job.companyName || job.title)?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1>{job.title}</h1>
                        {job.companyName && (
                            <p className="job-company-name">{job.companyName}</p>
                        )}
                        <div className="job-header-meta">
                            <span><FiMapPin size={13} /> {job.location}</span>
                            <span><FiBriefcase size={13} /> {job.employmentType}</span>
                            {job.createdAt && (
                                <span><FiClock size={13} /> {timeAgo(job.createdAt)}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="job-header-actions">
                    {isAuthenticated && role === "CANDIDATE" && (
                        <button
                            type="button"
                            className={"bookmark-button" + (saved ? " saved" : "")}
                            onClick={handleToggleSave}
                            aria-label={saved ? "Remove from saved jobs" : "Save job"}
                        >
                            <FiBookmark size={18} fill={saved ? "currentColor" : "none"} />
                        </button>
                    )}

                    <a href="#apply-section" className="apply-now-button">
                        Apply Now
                    </a>
                </div>
            </div>

            <div className="job-details-meta-row">
                <span className="salary"><FiDollarSign size={14} /> ₹{job.salary}</span>
                <span><FiBarChart2 size={14} /> {job.experienceLevel}</span>
            </div>

            <div className="job-details-columns">

                <div className="job-details-main">

                    <div className="job-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                className={"job-tab" + (activeTab === tab.key ? " active" : "")}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="job-tab-content">
                        {tabs.map((tab) =>
                            activeTab === tab.key ? (
                                <section key={tab.key}>
                                    <h2>{tab.label}</h2>
                                    {tab.key === "overview" ? (
                                        <p>{tab.content}</p>
                                    ) : (
                                        <BulletList text={tab.content} />
                                    )}
                                </section>
                            ) : null
                        )}
                    </div>

                    <div className="job-apply-section" id="apply-section">

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

                        <button className="apply-button" onClick={handleApply}>
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

                <aside className="job-company-sidebar">
                    <h2>About the Company</h2>

                    <div
                        className="job-logo job-logo-lg"
                        style={{ backgroundColor: getLogoColor(job.id) }}
                    >
                        {(job.companyName || job.title)?.charAt(0).toUpperCase()}
                    </div>

                    <h3>{job.companyName || "Company name not provided"}</h3>

                    {job.companyWebsite && (
                        <a
                            href={job.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="job-company-link"
                        >
                            <FiGlobe size={13} /> {job.companyWebsite}
                        </a>
                    )}
                </aside>

            </div>

        </div>
    );
}

export default JobDetails;