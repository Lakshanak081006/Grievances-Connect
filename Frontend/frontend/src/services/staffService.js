import api from "./api";

export const getStaffGrievances = async () => {
    const response = await api.get("/staff/grievances");
    return response.data;
};

export const markInProgress = async (id) => {
    const response = await api.put(`/staff/grievances/${id}/in-progress`);
    return response.data;
};

export const resolveGrievance = async (id) => {
    const response = await api.put(`/staff/grievances/${id}/resolve`);
    return response.data;
};

export const escalateToHod = async (id) => {
    const response = await api.put(`/staff/grievances/${id}/escalate`);
    return response.data;
};