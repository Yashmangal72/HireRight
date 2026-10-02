import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import JobCard from "../components/JobCard";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const EMPLOYMENT_TYPES = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
];

const EXPERIENCE_LEVELS = [
    { value: "ENTRY_LEVEL", label: "Entry Level" },
    { value: "MID_LEVEL", label: "Mid Level" },
    { value: "SENIOR_LEVEL", label: "Senior Level" },
];

const QUICK_LOCATIONS = ["Remote", "Bengaluru", "Delhi", "Hyderabad", "Mumbai"];
const QUICK_SKILLS = ["Java", "React", "Python", "Spring Boot"];

function Jobs() {
    const [searchParams] = useSearchParams();

    const [jobs, setJobs] = useState([]);

    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [location, setLocation] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState("desc");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async (overrides = {}) => {
        try {
            setLoading(true);
            setError("");

            const current = {
                keyword, location, employmentType, experienceLevel,
                minSalary, maxSalary, sortBy, direction, page,
                ...overrides,
            };

            const params = {
                page: current.page,
                size: 10,
                sortBy: current.sortBy,
                direction: current.direction,
            };

            if (current.keyword.trim()) params.keyword = current.keyword.trim();
            if (current.location.trim()) params.location = current.location.trim();
            if (current.employmentType) params.employmentType = current.employmentType;
            if (current.experienceLevel) params.experienceLevel = current.experienceLevel;
            if (current.minSalary) params.minSalary = Number(current.minSalary);
            if (current.maxSalary) params.maxSalary = Number(current.maxSalary);

            const response = await getJobs(params);

            setJobs(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);

        } catch (error) {
            console.error(error);
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs({ page });
    }, [page]);

    const handleSearch = (event) => {
        event?.preventDefault();
        setPage(0);
        fetchJobs({ page: 0 });
    };

    const handleReset = () => {
        setKeyword("");
        setLocation("");
        setEmploymentType("");
        setExperienceLevel("");
        setMinSalary("");
        setMaxSalary("");
        setSortBy("id");
        setDirection("desc");
        setPage(0);

        fetchJobs({
            keyword: "", location: "", employmentType: "", experienceLevel: "",
            minSalary: "", maxSalary: "", sortBy: "id", direction: "desc", page: 0,
        });
    };

    const toggleEmploymentType = (value) => {
        const next = employmentType === value ? "" : value;
        setEmploymentType(next);
        setPage(0);
        fetchJobs({ employmentType: next, page: 0 });
    };

    const toggleExperienceLevel = (value) => {
        const next = experienceLevel === value ? "" : value;
        setExperienceLevel(next);
        setPage(0);
        fetchJobs({ experienceLevel: next, page: 0 });
    };

    const applyQuickLocation = (value) => {
        const next = location === value ? "" : value;
        setLocation(next);
        setPage(0);
        fetchJobs({ location: next, page: 0 });
    };

    const applyQuickSkill = (value) => {
        setKeyword(value);
        setPage(0);
        fetchJobs({ keyword: value, page: 0 });
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        let nextSortBy = "id";
        let nextDirection = "desc";

        if (value === "salary_desc") { nextSortBy = "salary"; nextDirection = "desc"; }
        else if (value === "salary_asc") { nextSortBy = "salary"; nextDirection = "asc"; }
        else if (value === "title_asc") { nextSortBy = "title"; nextDirection = "asc"; }

        setSortBy(nextSortBy);
        setDirection(nextDirection);
        setPage(0);
        fetchJobs({ sortBy: nextSortBy, direction: nextDirection, page: 0 });
    };

    const activeFilterCount = [
        location, employmentType, experienceLevel, minSalary, maxSalary,
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
                            Clear All
                        </button>
                    )}
                </div>

                <div className="filter-section">
                    <h3>Job Type</h3>
                    {EMPLOYMENT_TYPES.map((type) => (
                        <label className="filter-checkbox" key={type.value}>
                            <input
                                type="checkbox"
                                checked={employmentType === type.value}
                                onChange={() => toggleEmploymentType(type.value)}
                            />
                            <span>{type.label}</span>
                        </label>
                    ))}
                </div>

                <div className="filter-section">
                    <h3>Experience Level</h3>
                    {EXPERIENCE_LEVELS.map((level) => (
                        <label className="filter-checkbox" key={level.value}>
                            <input
                                type="checkbox"
                                checked={experienceLevel === level.value}
                                onChange={() => toggleExperienceLevel(level.value)}
                            />
                            <span>{level.label}</span>
                        </label>
                    ))}
                </div>

                <div className="filter-section">
                    <h3>Location</h3>
                    {QUICK_LOCATIONS.map((loc) => (
                        <label className="filter-checkbox" key={loc}>
                            <input
                                type="checkbox"
                                checked={location === loc}
                                onChange={() => applyQuickLocation(loc)}
                            />
                            <span>{loc}</span>
                        </label>
                    ))}
                    <input
                        type="text"
                        className="filter-custom-input"
                        placeholder="Or type a city..."
                        value={QUICK_LOCATIONS.includes(location) ? "" : location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                <div className="filter-section">
                    <h3>Skills</h3>
                    <div className="filter-skill-tags">
                        {QUICK_SKILLS.map((skill) => (
                            <button
                                type="button"
                                key={skill}
                                className={
                                    "filter-skill-tag" +
                                    (keyword === skill ? " active" : "")
                                }
                                onClick={() => applyQuickSkill(skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <h3>Salary Range</h3>
                    <input
                        type="number"
                        placeholder="Min salary"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        className="filter-custom-input"
                    />
                    <input
                        type="number"
                        placeholder="Max salary"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        className="filter-custom-input"
                        style={{ marginTop: "0.5rem" }}
                    />
                    <button
                        type="button"
                        className="jobs-filter-apply"
                        onClick={handleSearch}
                    >
                        Apply
                    </button>
                </div>
            </aside>

            <div className="jobs-main">

                <form className="jobs-keyword-bar" onSubmit={handleSearch}>
                    <FiSearch size={18} className="jobs-keyword-icon" />
                    <input
                        type="text"
                        placeholder="Search jobs, company or skills..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>

                <div className="jobs-results-bar">
                    <span className="jobs-results-count">
                        {loading ? "Searching..." : `${totalElements} Jobs Found`}
                    </span>

                    <div className="jobs-sort">
                        <label>Sort by:</label>
                        <select onChange={handleSortChange} defaultValue="recent">
                            <option value="recent">Relevance</option>
                            <option value="salary_desc">Salary: High to Low</option>
                            <option value="salary_asc">Salary: Low to High</option>
                            <option value="title_asc">Title: A-Z</option>
                        </select>
                    </div>
                </div>

                {error && <p className="jobs-error">{error}</p>}

                {!loading && !error && jobs.length === 0 && (
                    <p className="jobs-status">No jobs found.</p>
                )}

                {!loading && !error && jobs.length > 0 && (
                    <div className="jobs-list">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
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
                        <span>Page {page + 1} of {totalPages}</span>
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