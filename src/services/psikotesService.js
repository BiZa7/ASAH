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
    // 1. Ambil token mentah
    let token = localStorage.getItem("accessToken");

    // 2. CEK & BERSIHKAN: Jika token ada tanda kutip ekstra (misal: '"eyJh..."'), hapus.
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    // Debugging: Cek di console browser apakah token bersih (tanpa kutip) atau null
    console.log("Token yang dikirim:", token);

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login ulang.");
    }

    console.log(`payload: ${payload}`);  

    const response = await fetch("http://localhost:3000/psychotest/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pastikan spasi setelah Bearer
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Baca error message dari backend jika ada
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.message || "Gagal mengirim jawaban (401 Unauthorized)"
      );
    }

    return await response.json();
  },
};
