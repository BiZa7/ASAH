import React, { useState, useRef, useEffect } from 'react';
import { Bot, SendHorizontal, User } from 'lucide-react';
import { getBotResponse } from '../utils/chatbotData';
import './Chatbot.css';

export const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Halo! Saya ASAH Assistant. Ada yang bisa saya bantu terkait materi NFR hari ini?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Auto scroll ke pesan terbawah
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    
    // 1. Tambahkan pesan user ke UI
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true); // Efek "sedang mengetik"

    // 2. Simulasi delay AI berpikir (1-2 detik)
    setTimeout(() => {
      // 3. Ambil jawaban dari file data
      const botReplyText = getBotResponse(userMessage.text);
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: botReplyText, 
        sender: 'bot' 
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000); 
  };

  return (
    <div className="chatbot-container">
      
      {/* Area Chat */}
      <div className="chat-area">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message-wrapper ${msg.sender}`} // Class user/bot dinamis
          >
            {/* Avatar */}
            <div className={`chat-avatar ${msg.sender}`}>
              {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* Bubble */}
            <div className={`chat-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            ASAH Assistant sedang mengetik...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-wrapper">
        <form className="chat-input-container" onSubmit={handleSend}>
          <input 
            className="chat-input-field"
            type="text" 
            placeholder="Tanyakan tentang NFR, Keamanan, dll..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-send">
            <SendHorizontal size={18} />
          </button>
        </form>
        <p className="ai-disclaimer">
          AI dilatih menggunakan materi NFRD yang tersedia.
        </p>
      </div>
    </div>
  );
};