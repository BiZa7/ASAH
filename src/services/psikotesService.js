import api from "../utils/api";

export const psikotesService = {
  // Get soal psikotes (otomatis assign ke user)
  getQuestions: async () => {
    try {
      const response = await api.get("/psychotest/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit jawaban psikotes
  submitAnswers: async (payload) => {
    try {
      const response = await api.post("/psychotest/submit", payload);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Gagal mengirim jawaban.";
      throw new Error(message);
    }
  },

  startRetake: async () => {
    try {
      const response = await api.post("/psychotest/retake");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Gagal memulai psikotes ulang.";
      throw new Error(message);
    }
  },
};
