import api from "../utils/api";

export const userService = {
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await api.patch("/users/me", payload);
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete("/users/me");
    return response.data;
  },
};
