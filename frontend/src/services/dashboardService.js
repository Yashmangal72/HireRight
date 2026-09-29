import api from "./api";

export const getCandidateDashboard = async () => {
    const response = await api.get("/dashboard/candidate");
    return response.data;
};

export const getRecruiterDashboard = async () => {
    const response = await api.get("/dashboard/recruiter");
    return response.data;
};