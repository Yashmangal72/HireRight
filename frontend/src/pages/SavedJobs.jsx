import { useEffect, useState } from "react";
import { getSavedJobs } from "../services/savedJobService";
import JobCard from "../components/JobCard";

function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const data = await getSavedJobs();
                setSavedJobs(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load saved jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, []);

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading saved jobs...</h2>
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
        <div className="jobs-page">

            <div className="jobs-header">
                <h1 className="jobs-title">Saved Jobs</h1>
                <p className="jobs-subtitle">
                    Jobs you've bookmarked for later
                </p>
            </div>

            {savedJobs.length === 0 ? (
                <div className="empty-state">
                    <h2>No Saved Jobs</h2>
                    <p>
                        Bookmark jobs you're interested in and they'll show
                        up here.
                    </p>
                </div>
            ) : (
                <div className="jobs-list">
                    {savedJobs.map((savedJob) => (
                        <JobCard
                            key={savedJob.savedJobId}
                            job={savedJob.job}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default SavedJobs;