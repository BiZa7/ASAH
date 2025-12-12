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

  getMaterialUser: async (phaseName = "") => {
    try {
      // 1. Ambil & Bersihkan Token
      let token = localStorage.getItem("accessToken");
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      // 2. Request GET ke endpoint backend
      // URL: /ai/content?phaseName=...
      // Backend Anda menggunakan @Query('phaseName'), jadi masuk ke params
      const response = await api.get("/ai/content", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          phaseName: phaseName, // Kirim string kosong untuk ambil semua, atau nama phase spesifik
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  selectedCareer: async (payload) => {
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
      const response = await api.post("/roadmap/select", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  generateContent: async (payload) => {
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
      const response = await api.post("/ai/content", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  generateFullRoadmap: async (idCareer) => {
    try {
      let token = localStorage.getItem("accessToken");
      if (token && token.startsWith('"')) token = token.slice(1, -1);

      // Panggil endpoint controller di atas
      const response = await api.post(
        "/ai/generate-roadmap", // Sesuaikan prefix controller Anda
        { id_career: idCareer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
