import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

const InputArea = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [sendOnEnter, setSendOnEnter] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setTokenCount(0);
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setTokenCount(countTokens(newMessage));
    adjustTextareaHeight();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && sendOnEnter) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleSendOnEnter = () => {
    const newSendOnEnter = !sendOnEnter;
    setSendOnEnter(newSendOnEnter);
    localStorage.setItem('sendOnEnter', JSON.stringify(newSendOnEnter));
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const savedSendOnEnter = localStorage.getItem('sendOnEnter');
    if (savedSendOnEnter !== null) {
      setSendOnEnter(JSON.parse(savedSendOnEnter));
    }
  }, []);

  // Fungsi sederhana untuk menghitung token (dalam hal ini, kita menganggap satu kata sebagai satu token)
  const countTokens = (text) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="bg-white p-3 border-t">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={sendOnEnter} onChange={toggleSendOnEnter} />
              <div className={`block w-8 h-4 rounded-full transition-colors duration-300 ease-in-out ${sendOnEnter ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-300 ease-in-out ${sendOnEnter ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className={`ml-2 text-xs font-medium ${sendOnEnter ? 'text-blue-500' : 'text-gray-600'}`}>
              Enter untuk kirim
            </span>
          </label>
          <span className="text-xs font-medium text-gray-600">
            Token: {tokenCount}
          </span>
        </div>
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan..."
            className="w-full p-2 pr-10 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[40px] max-h-[160px] overflow-y-auto text-sm"
            rows="1"
          />
          <button
            type="submit"
            className={`absolute bottom-1.5 right-1.5 p-1.5 rounded-full transition-all duration-300 ease-in-out ${
              message.trim() 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!message.trim()}
          >
            <Send size={18} className={message.trim() ? 'transform rotate-0' : 'transform -rotate-45'} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;