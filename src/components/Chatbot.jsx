import React, { useState, useRef, useEffect } from 'react';
import { Bot, SendHorizontal, User } from 'lucide-react';
import api from '../utils/api'; 
import AIOutputRenderer from './AIOutputRenderer'; // 1. IMPORT KOMPONEN INI
import './Chatbot.css';

export const Chatbot = ({ initialContext }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Halo! Saya ASAH Assistant. Ada yang bisa saya bantu terkait materi pembelajaranmu hari ini?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Logic initial context...
  }, [initialContext]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    const tempId = Date.now();

    // Tambah pesan user
    const userMessage = { id: tempId, text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    setInput("");
    setIsLoading(true);

    try {
      let token = localStorage.getItem("accessToken");
      if (token && token.startsWith('"')) token = token.slice(1, -1);

      const response = await api.post('/ai/chat', 
        { message: userText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botResponse = response.data;
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: botResponse.reply, 
        sender: 'bot',
        sources: botResponse.sources 
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: "Maaf, saya sedang mengalami gangguan koneksi.", 
        sender: 'bot',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      
      <div className="chat-area">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message-wrapper ${msg.sender}`} 
          >
            <div className={`chat-avatar ${msg.sender}`}>
              {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            <div className={`chat-bubble ${msg.sender} ${msg.isError ? 'error-bubble' : ''}`}>
              
              {/* 2. MODIFIKASI BAGIAN INI */}
              {msg.sender === 'bot' ? (
                // Gunakan Renderer Estetik untuk Bot
                // Bungkus dengan div khusus untuk override CSS di chat
                <div className="bot-markdown-content">
                   <AIOutputRenderer content={msg.text} />
                </div>
              ) : (
                // User tetap teks biasa (agar inputnya persis yg dia ketik)
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              )}

              {/* Sources RAG */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="chat-sources">
                  <small>Sumber:</small>
                  <ul>
                    {msg.sources.map((src, idx) => (
                      <li key={idx}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-wrapper bot">
             <div className="chat-avatar bot"><Bot size={18} /></div>
             <div className="chat-bubble bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <form className="chat-input-container" onSubmit={handleSend}>
          <input 
            className="chat-input-field"
            type="text" 
            placeholder={isLoading ? "Sedang berpikir..." : "Tanya materi ini..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="btn-send" disabled={isLoading || !input.trim()}>
            <SendHorizontal size={18} />
          </button>
        </form>
        <p className="ai-disclaimer">
          AI menjawab berdasarkan materi roadmap kamu.
        </p>
      </div>
    </div>
  );
};