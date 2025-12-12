import React from 'react';
import '../pages/PsikotesPage.css'; // Pastikan path CSS sesuai

// Helper function warna (bisa ditaruh di sini atau utils)
const getScaleColor = (val) => {
  switch (val) {
    case 5: return "#16A34A"; // Hijau Tua
    case 4: return "#22C55E"; // Hijau Muda
    case 3: return "#64748B"; // Kuning (Abu kebiruan di kode asli)
    case 2: return "#EAB308"; // Oranye
    case 1: return "#EF4444"; // Merah
    default: return "#0B4251";
  }
};

export const QuestionCard = ({ question, selectedAnswer, onSelect }) => {
  // Cek tipe pertanyaan
  const isOceanQuestion = [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism",
  ].includes(question.type_question);

  const handleClick = (value) => {
    if (selectedAnswer === value) {
      onSelect(null); // Unselect (kirim null jika diklik lagi)
    } else {
      onSelect(value); // Select baru
    }
  };

  return (
    <div className="question-card">
      <h2 className="question-text">{question.question}</h2>

      <div className="options-container">
        {isOceanQuestion ? (
          // --- OCEAN (Skala 1-5) ---
          <>
            {[5, 4, 3, 2, 1].map((value) => (
              <button
                key={value}
                className={`option-button ${
                  selectedAnswer === value ? "selected" : ""
                }`}
                // ✅ UPDATE DI SINI: Panggil handleClick
                onClick={() => handleClick(value)}
              >
                <span className="option-label">
                  {value === 1 && "Sangat Tidak Setuju"}
                  {value === 2 && "Tidak Setuju"}
                  {value === 3 && "Netral"}
                  {value === 4 && "Setuju"}
                  {value === 5 && "Sangat Setuju"}
                </span>

                <span
                  className="option-value"
                  style={{
                    backgroundColor: getScaleColor(value),
                    color: "white",
                    borderColor: "transparent",
                  }}
                >
                  {value}
                </span>
              </button>
            ))}
          </>
        ) : (
          // --- APTITUDE (Pilihan Ganda A-D) ---
          <>
            {["A", "B", "C", "D"].map((letter) => {
              // Ambil teks opsi dari objek question (misal: question.optionA)
              const optionKey = `option${letter}`;
              const optionText = question[optionKey];

              return (
                <button
                  key={letter}
                  className={`option-button ${
                    selectedAnswer === optionText ? "selected" : ""
                  }`}
                  // ✅ UPDATE DI SINI: Panggil handleClick
                  onClick={() => handleClick(optionText)}
                >
                  <span className="option-letter">{letter}. </span>
                  <span className="option-text">{optionText}</span>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};