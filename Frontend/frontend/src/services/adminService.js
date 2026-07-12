import api from "./api";

export const createUser = async (data) => {
    const response = await api.post("/admin/users", data);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/admin/all-users");
    return response.data;
};

export const getAllGrievances = async () => {
    const response = await api.get("/admin/grievances");
    return response.data;
};