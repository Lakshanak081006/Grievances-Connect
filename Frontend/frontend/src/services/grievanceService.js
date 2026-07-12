import api from "./api";


export const submitGrievance = async (formData) => {
    const response = await api.post(
        "/student/grievances",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getMyGrievances = async () => {
    const response = await api.get("/student/grievances");
    return response.data;
};

export const getGrievanceHistory = async (id) => {
    const response = await api.get(`/student/grievances/${id}/history`);
    return response.data;
};
export const getStaffList = async () => {
    const response = await api.get("/public/staff");
    return response.data;
};