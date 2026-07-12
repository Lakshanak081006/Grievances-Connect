import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/student/notifications");
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/student/notifications/${id}/read`);
  return response.data;
};