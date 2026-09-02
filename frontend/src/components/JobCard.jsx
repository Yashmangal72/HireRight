import { Link } from "react-router-dom";

function JobCard({ job }) {
    return (
        <div className="job-card">
            <div className="job-card-header">
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

            <div className="job-card-footer">
                <Link to={`/jobs/${job.id}`} className="details-button">
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default JobCard;