// src/components/AIOutputRenderer.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Pilih tema warna kode favorit Anda. 'dracula' atau 'vscDarkPlus' populer.
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
import './AIOutputRenderer.css'; // Kita akan buat CSS ini di langkah 3

const AIOutputRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="ai-output-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Aktifkan fitur GFM (tabel, dll)
        components={{
          // --- KUSTOMISASI BLOK KODE ---
          code({node, inline, className, children, ...props}) {
            // Deteksi bahasa pemrograman dari class markdown (misal: language-js)
            const match = /language-(\w+)/.exec(className || '');
            
            // Jika ini adalah blok kode (bukan inline code) dan bahasanya terdeteksi
            return !inline && match ? (
              <div className="code-block-wrapper">
                {/* Header kecil untuk menunjukkan bahasa */}
                <div className="code-header">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={dracula} // Tema warna
                  language={match[1]} // Bahasa (js, python, css, dll)
                  PreTag="div" // Gunakan div sebagai wrapper
                  className="code-highlighter"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              // Jika ini hanya inline code (kode pendek di tengah kalimat)
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },

          // --- KUSTOMISASI ELEMEN LAIN (Opsional agar lebih spesifik) ---
          // Anda bisa menimpa style elemen HTML standar di sini jika CSS saja tidak cukup
          h1: ({node, ...props}) => <h1 className="ai-heading h1" {...props} />,
          h2: ({node, ...props}) => <h2 className="ai-heading h2" {...props} />,
          h3: ({node, ...props}) => <h3 className="ai-heading h3" {...props} />,
          ul: ({node, ...props}) => <ul className="ai-list ul" {...props} />,
          ol: ({node, ...props}) => <ol className="ai-list ol" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="ai-blockquote" {...props} />,
           // Untuk link agar buka di tab baru
          a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className="ai-link" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default AIOutputRenderer;