export const knowledgeBase = [
  {
    keywords: ["halo", "hi", "hai", "selamat", "pagi", "siang", "malam"],
    response: "Halo! Saya ASAH Assistant. Saya telah mempelajari dokumen 'Kebutuhan Non-Fungsional (NFRD)'. Tanyakan saya tentang NFR, Performa, Keamanan, atau kriteria SMART!"
  },
  {
    keywords: ["apa itu nfr", "definisi nfr", "non-fungsional", "non fungsional"],
    response: "Kebutuhan Non-Fungsional (NFRs) mendefinisikan BAGAIMANA sebuah sistem harus bekerja, bukan APA yang dilakukannya. NFRs berfokus pada atribut kualitas seperti kinerja, keamanan, keandalan, dan kemudahan penggunaan."
  },
  {
    keywords: ["beda", "perbedaan", "fungsional"],
    response: "Bedanya adalah: Kebutuhan Fungsional itu seperti 'Mobil harus bisa jalan dari A ke B' (Fungsi). Sedangkan Non-Fungsional itu seperti 'Mobil harus melaju 100km/jam dalam 5 detik & aman' (Kualitas/Performa)."
  },
  {
    keywords: ["penting", "kenapa nfr", "manfaat"],
    response: "NFRs penting untuk mitigasi risiko (mencegah performa buruk), membantu keputusan arsitektur teknis, meningkatkan kepuasan pengguna, dan memenuhi standar regulasi/hukum."
  },
  {
    keywords: ["performa", "performance", "cepat", "lambat", "throughput", "latency"],
    response: "Kategori Performa mengukur kecepatan respons. Contoh NFR SMART: 'Halaman beranda harus dimuat dalam waktu kurang dari 2 detik pada 95% kasus penggunaan' atau 'Sistem memproses 500 transaksi per detik'."
  },
  {
    keywords: ["keamanan", "security", "enkripsi", "autentikasi"],
    response: "Kategori Keamanan melindungi data dari akses tidak sah. Contoh NFR: 'Sistem harus mendukung autentikasi Multi-Faktor (MFA)' atau 'Data sensitif harus dienkripsi menggunakan AES-256'."
  },
  {
    keywords: ["smart", "kriteria smart", "cara nulis", "efektif"],
    response: "Untuk menulis NFR yang efektif, gunakan kriteria SMART: Specific (Spesifik), Measurable (Terukur), Achievable (Dapat Dicapai), Relevant (Relevan), dan Time-bound/Testable (Dapat Diuji)."
  },
  {
    keywords: ["skalabilitas", "scalability", "user banyak", "beban"],
    response: "Skalabilitas adalah kemampuan sistem menangani peningkatan beban. Contoh: 'Sistem harus mampu menangani peningkatan pengguna hingga 50% tanpa degradasi performa'."
  },
  {
    keywords: ["usability", "kemudahan", "penggunaan"],
    response: "Usability mengukur kemudahan interaksi. Contoh: 'Pengguna baru harus dapat menyelesaikan checkout tanpa pelatihan dalam waktu 10 menit'."
  },
  {
    keywords: ["dokumen", "struktur", "nfrd"],
    response: "Struktur Dokumen NFRD biasanya mencakup: 1. Pendahuluan, 2. Kebutuhan Bisnis, 3. Kebutuhan Teknis (Performa, Keamanan, dll), dan 4. Matriks Prioritas & Pengujian."
  }
];

// Fungsi logika pencarian jawaban
export const getBotResponse = (input) => {
  const lowerInput = input.toLowerCase();
  
  // Cari data yang keyword-nya cocok dengan input user
  const match = knowledgeBase.find(item => 
    item.keywords.some(keyword => lowerInput.includes(keyword))
  );

  if (match) {
    return match.response;
  }

  // Jawaban default jika tidak mengerti
  return "Maaf, saya kurang paham. Coba tanya tentang 'Apa itu NFR', 'Keamanan', 'Performa', atau 'SMART'.";
};