import api from "../utils/api";

export const optionCareer = {
  // Method POST untuk generate/mendapatkan rekomendasi baru
  getCareerRecommendation: async () => {
    try {
      // 1. Ambil & Bersihkan Token
      let token = localStorage.getItem("accessToken");
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      // 2. Lakukan Request POST
      // Endpoint disesuaikan dengan controller: @Post('mapping') -> '/roadmap/mapping'
      // Asumsi controller prefix-nya adalah 'roadmap'
      const response = await api.post(
        "/ai/mapping",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Method GET untuk mengambil data yang sudah tersimpan (jika perlu)
  getOptionsCareer: async () => {
    try {
      // 1. Ambil & Bersihkan Token (PENTING: Sama seperti method POST)
      let token = localStorage.getItem("accessToken");
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      // 2. Request GET ke endpoint backend
      // Backend: @Get('option') di controller 'roadmap' -> '/roadmap/option'
      const response = await api.get("/roadmap/option", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
