import api from "./api";

export const getJobs = async (params = {}) => {
    const response = await api.get("/jobs", {
        params
    });

    return response.data;
};

export const getJobById = async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
};