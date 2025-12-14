// services/quizService.js
import api from "../utils/api"; // Axios instance Anda

export const quizService = {
  getQuizByRoadmapId: async (idRoadmapItem) => {
    try {
      const response = await api.get(`/ai/quizzes/${idRoadmapItem}`);
      return response.data; // Mengembalikan { status, data: [...] }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  generateQuiz: async (idRoadmapItem) => {
    let token = localStorage.getItem("accessToken");

    // 1. Bersihkan token (jika ada kutip ganda)
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login ulang.");
    }

    // 2. Siapkan Payload (Body) sesuai DTO backend
    // Backend mengharapkan: @Body() body: { id_roadmap_item: string }
    const payload = {
      id_roadmap_item: idRoadmapItem,
    };

    // 3. Konfigurasi Header (Penting untuk AuthGuard)
    // Jika instance 'api' Anda belum otomatis meng-inject token, tambahkan manual di sini:
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // 4. Request ke Endpoint
    // URL berubah dari '/ai/quizzes/:id/:item' menjadi '/ai/quizzes'
    // idUser diambil backend dari token, idRoadmapItem diambil dari body
    try {
      const response = await api.post("/ai/quizzes", payload, config);
      return response.data;
    } catch (error) {
      // Error handling standar
      throw error.response?.data || error.message;
    }
  },

  submitQuiz: async (idRoadmapItem, score) => {
    let token = localStorage.getItem("accessToken");

    // 1. Bersihkan token (jika ada kutip ganda)
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login ulang.");
    }

    // 2. Siapkan Payload (Body: { score: number })
    const payload = {
      score: score
    };

    // 3. Konfigurasi Header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      // 4. Request PATCH ke backend
      // Asumsi prefix controller adalah 'ai' sesuai konteks sebelumnya (/ai/quizzes/:id)
      // Jika controller tidak punya prefix 'ai', ubah jadi `/quizzes/${idRoadmapItem}`
      const response = await api.patch(`/ai/quizzes/${idRoadmapItem}`, payload, config);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
