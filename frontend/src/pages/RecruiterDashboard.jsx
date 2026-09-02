import { useState } from "react";
import { createJob } from "../services/recruiterService";

function RecruiterDashboard() {
    const [job, setJob] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        employmentType: "FULL_TIME",
        experienceLevel: "ENTRY_LEVEL",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        try {
            await createJob({
                ...job,
                salary: Number(job.salary),
            });

            setMessage("Job created successfully!");

            setJob({
                title: "",
                description: "",
                location: "",
                salary: "",
                employmentType: "FULL_TIME",
                experienceLevel: "ENTRY_LEVEL",
            });

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create job"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recruiter-page">

            <div className="recruiter-header">
                <h1>Create a Job</h1>
                <p>Post a new opportunity for candidates</p>
            </div>

            <div className="create-job-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="title">
                            Job Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            value={job.title}
                            onChange={handleChange}
                            placeholder="e.g. Java Spring Boot Developer"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Job Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={job.description}
                            onChange={handleChange}
                            placeholder="Describe the role and responsibilities..."
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                value={job.location}
                                onChange={handleChange}
                                placeholder="e.g. Pune"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="salary">
                                Salary
                            </label>

                            <input
                                id="salary"
                                type="number"
                                name="salary"
                                value={job.salary}
                                onChange={handleChange}
                                placeholder="e.g. 750000"
                                min="0"
                                required
                            />
                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="employmentType">
                                Employment Type
                            </label>

                            <select
                                id="employmentType"
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
                            <label htmlFor="experienceLevel">
                                Experience Level
                            </label>

                            <select
                                id="experienceLevel"
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

                    <button
                        type="submit"
                        className="create-job-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating Job..." : "Create Job"}
                    </button>

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

export default RecruiterDashboard;