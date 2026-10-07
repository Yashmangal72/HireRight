import api from "./api";

export const scheduleInterview = async (applicationId, interviewData) => {
    const response = await api.post(
        `/applications/${applicationId}/interview`,
        interviewData
    );
    return response.data;
};

export const getInterview = async (applicationId) => {
    const response = await api.get(
        `/applications/${applicationId}/interview`
    );
    return response.data;
};

export const getMyInterviews = async () => {
    const response = await api.get("/recruiter/interviews");
    return response.data;
};

export const deleteInterview = async (applicationId) => {
    await api.delete(`/applications/${applicationId}/interview`);
};

export const markInterviewCompleted = async (applicationId) => {
    const response = await api.patch(
        `/applications/${applicationId}/interview/complete`
    );
    return response.data;
};