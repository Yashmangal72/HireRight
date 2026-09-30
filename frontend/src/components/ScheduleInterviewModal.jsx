import { useState } from "react";
import { FiX } from "react-icons/fi";
import { scheduleInterview } from "../services/interviewService";

function ScheduleInterviewModal({ application, existingInterview, onClose, onScheduled }) {
    const [scheduledAt, setScheduledAt] = useState(
        existingInterview?.scheduledAt?.slice(0, 16) || ""
    );
    const [interviewType, setInterviewType] = useState(
        existingInterview?.interviewType || "Technical"
    );
    const [durationMinutes, setDurationMinutes] = useState(
        existingInterview?.durationMinutes || 30
    );
    const [meetingLink, setMeetingLink] = useState(
        existingInterview?.meetingLink || ""
    );
    const [notes, setNotes] = useState(existingInterview?.notes || "");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await scheduleInterview(application.id, {
                scheduledAt,
                interviewType,
                durationMinutes: Number(durationMinutes),
                meetingLink,
                notes,
            });

            onScheduled(data);
            onClose();
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to schedule interview"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>
                        {existingInterview
                            ? "Reschedule Interview"
                            : "Schedule Interview"}
                    </h2>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <p className="modal-subtitle">
                    Candidate: <strong>{application.candidateName}</strong>{" "}
                    · {application.jobTitle}
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date & Time</label>
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration (minutes)</label>
                            <input
                                type="number"
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                                min="15"
                                step="15"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Interview Type</label>
                            <select
                                value={interviewType}
                                onChange={(e) => setInterviewType(e.target.value)}
                            >
                                <option value="Technical">Technical</option>
                                <option value="HR">HR</option>
                                <option value="Managerial">Managerial</option>
                                <option value="Final">Final Round</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Meeting Link (optional)</label>
                            <input
                                type="url"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                placeholder="https://meet.google.com/..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            placeholder="Any details for the candidate..."
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-edit-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="update-job-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : existingInterview
                                ? "Update Interview"
                                : "Schedule Interview"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ScheduleInterviewModal;