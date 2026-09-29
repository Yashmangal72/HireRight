import api from "./api";

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/users/me/resume", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getMyResumeInfo = async () => {
    const response = await api.get("/users/me/resume/info");
    return response.data;
};

export const downloadMyResume = async () => {
    const response = await api.get("/users/me/resume", {
        responseType: "blob",
    });
    return response.data;
};

export const downloadCandidateResume = async (applicationId) => {
    const response = await api.get(
        `/applications/${applicationId}/resume`,
        { responseType: "blob" }
    );
    return response.data;
};