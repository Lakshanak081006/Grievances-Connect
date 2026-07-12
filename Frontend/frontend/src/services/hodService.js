import api from "./api";

export const getHodGrievances = async () => {
    const response = await api.get("/hod/grievances");
    return response.data;
};

export const resolveByHod = async (id) => {
    const response = await api.put(`/hod/grievances/${id}/resolve`);
    return response.data;
};

export const escalateToPrincipal = async (id) => {
    const response = await api.put(`/hod/grievances/${id}/escalate`);
    return response.data;
};