import api from "./api";

export const saveJob = async (jobId) => {
    const response = await api.post(`/saved-jobs/${jobId}`);
    return response.data;
};

export const unsaveJob = async (jobId) => {
    await api.delete(`/saved-jobs/${jobId}`);
};

export const getSavedJobStatus = async (jobId) => {
    const response = await api.get(`/saved-jobs/${jobId}/status`);
    return response.data;
};

export const getSavedJobs = async () => {
    const response = await api.get("/saved-jobs");
    return response.data;
};