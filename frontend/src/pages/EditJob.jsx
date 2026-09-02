import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { updateJob } from "../services/recruiterService";

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(id);
                setJob(data);
            } catch (error) {
                console.error(error);
                setError(
                    error.response?.data?.message ||
                    "Failed to load job"
                );
            }
        };

        fetchJob();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setJob((currentJob) => ({
            ...currentJob,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await updateJob(id, {
                ...job,
                salary: Number(job.salary),
            });

            setMessage("Job updated successfully!");

            setTimeout(() => {
                navigate("/my-jobs");
            }, 800);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update job"
            );
        }
    };

    if (!job) {
        return (
            <div className="edit-job-page">
                <div className="edit-job-card">
                    <h2>Loading job...</h2>

                    {error && (
                        <p className="edit-job-error">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="edit-job-page">

            <div className="edit-job-header">
                <h1>Edit Job</h1>
                <p>Update your job posting</p>
            </div>

            <div className="edit-job-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Job Title</label>

                        <input
                            name="title"
                            value={job.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={job.description}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                name="location"
                                value={job.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Salary</label>

                            <input
                                type="number"
                                name="salary"
                                value={job.salary}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Employment Type</label>

                            <select
                                name="employmentType"
                                value={job.employmentType}
                                onChange={handleChange}
                            >
                                <option value="FULL_TIME">
                                    Full Time
                                </option>

                                <option value="PART_TIME">
                                    Part Time
                                </option>

                                <option value="CONTRACT">
                                    Contract
                                </option>

                                <option value="INTERNSHIP">
                                    Internship
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Experience Level</label>

                            <select
                                name="experienceLevel"
                                value={job.experienceLevel}
                                onChange={handleChange}
                            >
                                <option value="ENTRY_LEVEL">
                                    Entry Level
                                </option>

                                <option value="MID_LEVEL">
                                    Mid Level
                                </option>

                                <option value="SENIOR_LEVEL">
                                    Senior Level
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="edit-job-actions">

                        <button
                            type="button"
                            className="cancel-edit-btn"
                            onClick={() => navigate("/my-jobs")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="update-job-btn"
                        >
                            Update Job
                        </button>

                    </div>

                </form>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}

export default EditJob;