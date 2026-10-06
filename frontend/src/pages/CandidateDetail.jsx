import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getCandidateDetail,
    getCandidateNotes,
    addCandidateNote,
} from "../services/candidateDetailService";
import { downloadCandidateResume } from "../services/resumeService";
import StatusStepper from "../components/StatusStepper";
import {
    FiArrowLeft,
    FiMail,
    FiPhone,
    FiMapPin,
    FiDownload,
    FiFileText,
    FiClock,
} from "react-icons/fi";

function CandidateDetail() {
    const { candidateId } = useParams();
    const navigate = useNavigate();

    const [candidate, setCandidate] = useState(null);
    const [notes, setNotes] = useState([]);
    const [activeTab, setActiveTab] = useState("resume");
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [resumeError, setResumeError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detail, notesData] = await Promise.all([
                    getCandidateDetail(candidateId),
                    getCandidateNotes(candidateId),
                ]);
                setCandidate(detail);
                setNotes(notesData);
            } catch (error) {
                console.error(error);
                setError(
                    error.response?.data?.message ||
                    "Failed to load candidate"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [candidateId]);

    const handleDownloadResume = async () => {
        setResumeError("");

        try {
            const blob = await downloadCandidateResume(
                candidate.applications[0].id
            );
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = candidate.resumeFilename || "resume";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            setResumeError("Failed to download resume.");
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();

        if (!newNote.trim()) return;

        try {
            const saved = await addCandidateNote(candidateId, newNote.trim());
            setNotes((current) => [saved, ...current]);
            setNewNote("");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading candidate...</h2>
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
        <div className="candidate-detail-page">

            <button
                type="button"
                className="back-to-jobs"
                onClick={() => navigate("/recruiter/candidates")}
            >
                <FiArrowLeft size={15} /> Back to Candidates
            </button>

            <div className="candidate-detail-header">
                <div className="candidate-avatar candidate-avatar-lg">
                    {candidate.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h1>{candidate.name}</h1>
                    <div className="candidate-header-meta">
                        <span><FiMail size={13} /> {candidate.email}</span>
                        {candidate.phone && (
                            <span><FiPhone size={13} /> {candidate.phone}</span>
                        )}
                        {candidate.location && (
                            <span><FiMapPin size={13} /> {candidate.location}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="job-tabs">
                <button
                    type="button"
                    className={"job-tab" + (activeTab === "resume" ? " active" : "")}
                    onClick={() => setActiveTab("resume")}
                >
                    Resume
                </button>
                <button
                    type="button"
                    className={"job-tab" + (activeTab === "details" ? " active" : "")}
                    onClick={() => setActiveTab("details")}
                >
                    Details
                </button>
                <button
                    type="button"
                    className={"job-tab" + (activeTab === "history" ? " active" : "")}
                    onClick={() => setActiveTab("history")}
                >
                    Application History
                </button>
                <button
                    type="button"
                    className={"job-tab" + (activeTab === "notes" ? " active" : "")}
                    onClick={() => setActiveTab("notes")}
                >
                    Notes
                </button>
            </div>

            <div className="job-tab-content candidate-detail-content">

                {activeTab === "resume" && (
                    <section>
                        {candidate.hasResume ? (
                            <div className="resume-card">
                                <div className="resume-card-header">
                                    <div className="resume-icon">
                                        <FiFileText size={20} />
                                    </div>
                                    <div>
                                        <h2>Resume</h2>
                                        <p>{candidate.resumeFilename}</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={handleDownloadResume}
                                >
                                    <FiDownload size={14} /> Download
                                </button>
                            </div>
                        ) : (
                            <p className="dashboard-empty">
                                This candidate hasn't uploaded a resume.
                            </p>
                        )}

                        {resumeError && (
                            <p className="error-message">{resumeError}</p>
                        )}
                    </section>
                )}

                {activeTab === "details" && (
                    <section>
                        <h2>About</h2>
                        <p>{candidate.bio || "No bio provided."}</p>

                        {candidate.skills && (
                            <>
                                <h2 style={{ marginTop: "1.5rem" }}>Skills</h2>
                                <div className="job-meta">
                                    {candidate.skills.split(",").map((skill, i) => (
                                        <span className="job-meta-item" key={i}>
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>
                )}

                {activeTab === "history" && (
                    <section>
                        <h2>Application History</h2>
                        <div className="dashboard-list" style={{ marginTop: "1rem" }}>
                            {candidate.applications.map((application) => (
                                <div
                                    className="dashboard-list-item"
                                    key={application.id}
                                    style={{ flexDirection: "column", alignItems: "flex-start" }}
                                >
                                    <div style={{ marginBottom: "0.75rem" }}>
                                        <strong>{application.jobTitle}</strong>
                                        <p className="dashboard-item-meta">
                                            Applied{" "}
                                            {new Date(
                                                application.appliedAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <StatusStepper status={application.status} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "notes" && (
                    <section>
                        <h2>Notes</h2>

                        <form onSubmit={handleAddNote} className="note-form">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a private note about this candidate..."
                                rows="3"
                            />
                            <button type="submit" className="secondary-button">
                                Add Note
                            </button>
                        </form>

                        <div className="notes-list">
                            {notes.length === 0 ? (
                                <p className="dashboard-empty">No notes yet.</p>
                            ) : (
                                notes.map((note) => (
                                    <div className="note-item" key={note.id}>
                                        <p>{note.content}</p>
                                        <span className="note-timestamp">
                                            <FiClock size={11} />{" "}
                                            {new Date(
                                                note.createdAt
                                            ).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

            </div>

        </div>
    );
}

export default CandidateDetail;