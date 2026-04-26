import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiCpu } from 'react-icons/fi';
import { sendChatMessage } from '../services/api';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '🌾 Namaste! I\'m your Crop Assistant.\n\nTell me a crop name and I\'ll recommend the best seeds and fertilizers!\n\nTry: wheat, rice, tomato, cotton...',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { type: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { type: 'bot', text: data.botResponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: '⚠️ Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-wrapper" id="chatbot">
      {/* Floating Button */}
      <button
        className={`chatbot-fab ${isOpen ? 'chatbot-fab-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        id="chatbot-toggle"
        aria-label="Toggle chat assistant"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window animate-fade-in-up" id="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <FiCpu size={18} />
              </div>
              <div>
                <h4>Crop Assistant</h4>
                <span className="chatbot-status">● Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" id="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.type}`}>
                <div className="chat-bubble">
                  {msg.text.split('\n').map((line, j) => (
                    <span key={j}>
                      {line.replace(/\*\*(.*?)\*\*/g, '«$1»').split('«').map((part, k) => {
                        if (part.includes('»')) {
                          const [bold, rest] = part.split('»');
                          return <span key={k}><strong>{bold}</strong>{rest}</span>;
                        }
                        return <span key={k}>{part}</span>;
                      })}
                      {j < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg chat-msg-bot">
                <div className="chat-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a crop name..."
              disabled={loading}
              id="chatbot-input"
            />
            <button
              className="chatbot-send"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              id="chatbot-send"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
