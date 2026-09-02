import api from "./api";

export const applyForJob = async (jobId) => {
    const response = await api.post("/applications", {
        jobId: jobId,
    });

    return response.data;
};

export const getMyApplications = async () => {
    const response = await api.get("/applications/my");
    return response.data;
};

export const getAllApplications = async () => {
    const response = await api.get("/applications");
    return response.data;
};

export const updateApplicationStatus = async (id, status) => {
    const response = await api.put(
        `/applications/${id}/status`,
        {
            status: status,
        }
    );

    return response.data;
};