import { Link } from "react-router-dom";
import { FiMapPin, FiDollarSign, FiBriefcase, FiBarChart2 } from "react-icons/fi";

import { useEffect, useState } from "react";
import { FiBookmark } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import {
    saveJob,
    unsaveJob,
    getSavedJobStatus,
} from "../services/savedJobService";

const LOGO_COLORS = ["#4f46e5", "#0d9488", "#db2777", "#d97706", "#0891b2", "#65a30d"];

function getLogoColor(id) {
    return LOGO_COLORS[id % LOGO_COLORS.length];
}

function JobCard({ job }) {
    const { isAuthenticated, role } = useAuth();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isAuthenticated && role === "CANDIDATE") {
            getSavedJobStatus(job.id)
                .then((data) => setSaved(data.saved))
                .catch((error) => console.error(error));
        }
    }, [job.id, isAuthenticated, role]);

    const handleToggleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (saving) return;
        setSaving(true);

        try {
            if (saved) {
                await unsaveJob(job.id);
                setSaved(false);
            } else {
                await saveJob(job.id);
                setSaved(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="job-card">
            <div className="job-card-header">
                <div className="job-card-title-row">
                    <div
                        className="job-logo"
                        style={{ backgroundColor: getLogoColor(job.id) }}
                    >
                        {job.title?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h2>{job.title}</h2>
                        <p className="job-location">
                            <FiMapPin size={14} /> {job.location}
                        </p>
                    </div>
                </div>

                <div className="job-card-header-right">
                    {isAuthenticated && role === "CANDIDATE" && (
                        <button
                            type="button"
                            className={
                                "bookmark-button" + (saved ? " saved" : "")
                            }
                            onClick={handleToggleSave}
                            aria-label={
                                saved ? "Remove from saved jobs" : "Save job"
                            }
                            disabled={saving}
                        >
                            <FiBookmark
                                size={18}
                                fill={saved ? "currentColor" : "none"}
                            />
                        </button>
                    )}

                    <span className="job-id">#{job.id}</span>
                </div>
            </div>

            <p className="job-description">{job.description}</p>

            <div className="job-meta">
                <span className="job-meta-item salary">
                    <FiDollarSign size={14} /> ₹{job.salary}
                </span>
                <span className="job-meta-item">
                    <FiBriefcase size={14} /> {job.employmentType}
                </span>
                <span className="job-meta-item">
                    <FiBarChart2 size={14} /> {job.experienceLevel}
                </span>
            </div>

            <div className="job-card-footer">
                <Link to={`/jobs/${job.id}`} className="details-button">
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default JobCard;