import { useEffect, useRef, useState } from "react";
import { FiFile, FiUpload, FiDownload } from "react-icons/fi";
import {
    getMyResumeInfo,
    uploadResume,
    downloadMyResume,
} from "../services/resumeService";

function ResumeCard() {
    const [resumeInfo, setResumeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const fetchInfo = async () => {
        try {
            const data = await getMyResumeInfo();
            setResumeInfo(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError("");
        setUploading(true);

        try {
            const data = await uploadResume(file);
            setResumeInfo(data);
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message || "Failed to upload resume"
            );
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDownload = async () => {
        try {
            const blob = await downloadMyResume();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = resumeInfo.filename || "resume";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            setError("Failed to download resume");
        }
    };

    if (loading) {
        return null;
    }

    return (
        <div className="resume-card">
            <div className="resume-card-header">
                <div className="resume-icon">
                    <FiFile size={20} />
                </div>

                <div>
                    <h2>Resume</h2>
                    <p>
                        {resumeInfo?.hasResume
                            ? resumeInfo.filename
                            : "No resume uploaded yet"}
                    </p>
                </div>
            </div>

            <div className="resume-card-actions">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                />

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                >
                    <FiUpload size={14} />{" "}
                    {uploading
                        ? "Uploading..."
                        : resumeInfo?.hasResume
                        ? "Replace Resume"
                        : "Upload Resume"}
                </button>

                {resumeInfo?.hasResume && (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={handleDownload}
                    >
                        <FiDownload size={14} /> Download
                    </button>
                )}
            </div>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default ResumeCard;