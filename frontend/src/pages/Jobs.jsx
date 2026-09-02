import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import JobCard from "../components/JobCard";

function Jobs() {
    const [jobs, setJobs] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page,
                size: 10,
                sortBy: "id",
                direction: "desc"
            };

            if (keyword.trim()) {
                params.keyword = keyword.trim();
            }

            if (location.trim()) {
                params.location = location.trim();
            }

            if (employmentType) {
                params.employmentType = employmentType;
            }

            if (experienceLevel) {
                params.experienceLevel = experienceLevel;
            }

            if (minSalary) {
                params.minSalary = Number(minSalary);
            }

            if (maxSalary) {
                params.maxSalary = Number(maxSalary);
            }

            const response = await getJobs(params);

            setJobs(response.content);
            setTotalPages(response.totalPages);

        } catch (error) {
            console.error(error);
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const handleSearch = (event) => {
        event.preventDefault();

        setPage(0);
        fetchJobs();
    };

    const handleReset = () => {
        setKeyword("");
        setLocation("");
        setEmploymentType("");
        setExperienceLevel("");
        setMinSalary("");
        setMaxSalary("");
        setPage(0);

        setTimeout(() => {
            fetchJobs();
        }, 0);
    };

    return (
        <div className="jobs-page">

            <div className="jobs-header">
                <h1 className="jobs-title">Available Jobs</h1>
                <p className="jobs-subtitle">
                    Find your next opportunity
                </p>
            </div>

            <form className="job-filters" onSubmit={handleSearch}>

                <div className="filter-row">

                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                    >
                        <option value="">Employment Type</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERNSHIP">Internship</option>
                    </select>

                    <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                    >
                        <option value="">Experience Level</option>
                        <option value="ENTRY_LEVEL">Entry Level</option>
                        <option value="MID_LEVEL">Mid Level</option>
                        <option value="SENIOR_LEVEL">Senior Level</option>
                    </select>

                </div>

                <div className="filter-row">

                    <input
                        type="number"
                        placeholder="Minimum Salary"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Maximum Salary"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                    />

                    <button type="submit">
                        Search
                    </button>

                    <button
                        type="button"
                        className="reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                </div>

            </form>

            {loading && (
                <p className="jobs-status">
                    Loading jobs...
                </p>
            )}

            {error && (
                <p className="jobs-error">
                    {error}
                </p>
            )}

            {!loading && !error && jobs.length === 0 && (
                <p className="jobs-status">
                    No jobs found.
                </p>
            )}

            {!loading && !error && jobs.length > 0 && (
                <div className="jobs-list">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                        />
                    ))}
                </div>
            )}

            {!loading && !error && totalPages > 1 && (
                <div className="pagination">

                    <button
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page + 1} of {totalPages}
                    </span>

                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    );
}

export default Jobs;