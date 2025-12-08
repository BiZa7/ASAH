import api from '../utils/api';

export const psikotesService = {
  // Get soal psikotes (otomatis assign ke user)
  getQuestions: async () => {
    try {
      const response = await api.get('/psychotest/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit jawaban psikotes
  submitAnswers: async (userAnswers) => {
    try {
      const response = await api.post('/psychotest/submit', {
        user_answers: userAnswers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};