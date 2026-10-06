import api from "./api";

export const getCandidateDetail = async (candidateId) => {
    const response = await api.get(`/recruiter/candidates/${candidateId}`);
    return response.data;
};

export const getCandidateNotes = async (candidateId) => {
    const response = await api.get(`/recruiter/candidates/${candidateId}/notes`);
    return response.data;
};

export const addCandidateNote = async (candidateId, content) => {
    const response = await api.post(
        `/recruiter/candidates/${candidateId}/notes`,
        { content }
    );
    return response.data;
};