import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import JobCard from "../components/JobCard";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

function Jobs() {
    const [searchParams] = useSearchParams();

    const [jobs, setJobs] = useState([]);

    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
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

    const activeFilterCount = [
        location,
        employmentType,
        experienceLevel,
        minSalary,
        maxSalary,
    ].filter(Boolean).length;

    return (
        <div className="jobs-page-layout">

            <aside className="jobs-filter-sidebar">
                <div className="jobs-filter-header">
                    <h2>Filters</h2>
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            className="jobs-filter-clear"
                            onClick={handleReset}
                        >
                            <FiX size={14} /> Clear
                        </button>
                    )}
                </div>

                <form onSubmit={handleSearch} className="jobs-filter-form">

                    <div className="filter-group">
                        <label>Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Mumbai"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Employment Type</label>
                        <select
                            value={employmentType}
                            onChange={(e) => setEmploymentType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="INTERNSHIP">Internship</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Experience Level</label>
                        <select
                            value={experienceLevel}
                            onChange={(e) => setExperienceLevel(e.target.value)}
                        >
                            <option value="">All Levels</option>
                            <option value="ENTRY_LEVEL">Entry Level</option>
                            <option value="MID_LEVEL">Mid Level</option>
                            <option value="SENIOR_LEVEL">Senior Level</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Minimum Salary</label>
                        <input
                            type="number"
                            placeholder="e.g. 30000"
                            value={minSalary}
                            onChange={(e) => setMinSalary(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Maximum Salary</label>
                        <input
                            type="number"
                            placeholder="e.g. 100000"
                            value={maxSalary}
                            onChange={(e) => setMaxSalary(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="jobs-filter-apply">
                        Apply Filters
                    </button>

                </form>
            </aside>

            <div className="jobs-main">

                <div className="jobs-header">
                    <h1 className="jobs-title">Available Jobs</h1>
                    <p className="jobs-subtitle">
                        Find your next opportunity
                    </p>
                </div>

                <form className="jobs-keyword-bar" onSubmit={handleSearch}>
                    <FiSearch size={18} className="jobs-keyword-icon" />
                    <input
                        type="text"
                        placeholder="Search jobs, skills or companies..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit">Search</button>
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

        </div>
    );
}

export default Jobs;