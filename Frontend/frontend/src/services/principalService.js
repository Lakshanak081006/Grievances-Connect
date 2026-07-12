import api from "./api";

export const getPrincipalGrievances = async () => {
    const response = await api.get("/principal/grievances");
    return response.data;
};

export const resolveByPrincipal = async (id) => {
    const response = await api.put(`/principal/grievances/${id}/resolve`);
    return response.data;
};

export const closeByPrincipal = async (id) => {
    const response = await api.put(`/principal/grievances/${id}/close`);
    return response.data;
};