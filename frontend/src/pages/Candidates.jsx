import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCandidates } from "../services/applicationService";
import { FiSearch } from "react-icons/fi";

function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await getCandidates();
                setCandidates(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load candidates");
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter((candidate) => {
        const query = search.toLowerCase();

        return (
            candidate.candidateName?.toLowerCase().includes(query) ||
            candidate.candidateEmail?.toLowerCase().includes(query) ||
            candidate.skills?.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading candidates...</h2>
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
        <div className="candidates-page">

            <div className="page-heading">
                <h1>Candidates</h1>
                <p>Everyone who has applied to your job postings</p>
            </div>

            <div className="candidates-search-bar">
                <FiSearch size={16} />
                <input
                    type="text"
                    placeholder="Search by name, email or skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {candidates.length === 0 ? (
                <div className="empty-state">
                    <h2>No Candidates Yet</h2>
                    <p>
                        Once candidates apply to your jobs, they'll show up here.
                    </p>
                </div>
            ) : filteredCandidates.length === 0 ? (
                <div className="empty-state">
                    <h2>No Matches</h2>
                    <p>
                        No candidates match your search.
                    </p>
                </div>
            ) : (
                <div className="candidates-table-wrapper">
                    <table className="candidates-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Latest Position</th>
                                <th>Skills</th>
                                <th>Applications</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map((candidate) => (
                                <tr key={candidate.candidateId}>
                                    <td>
                                        <div className="candidate-cell-name">
                                            <div className="candidate-avatar">
                                                {candidate.candidateName
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <strong>
                                                    {candidate.candidateName}
                                                </strong>
                                                <p>{candidate.candidateEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{candidate.latestJobTitle}</td>
                                    <td className="candidate-skills-cell">
                                        {candidate.skills || "—"}
                                    </td>
                                    <td>{candidate.totalApplications}</td>
                                    <td>
                                        <span
                                            className={
                                                "status-badge status-" +
                                                candidate.latestStatus.toLowerCase()
                                            }
                                        >
                                            {candidate.latestStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/recruiter/candidates/${candidate.candidateId}`}
                                            className="candidate-view-link"
                                        >
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}

export default Candidates;