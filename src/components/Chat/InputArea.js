import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const InputArea = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [sendOnEnter, setSendOnEnter] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
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
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording functionality
  };

  useEffect(() => {
    const savedSendOnEnter = localStorage.getItem('sendOnEnter');
    if (savedSendOnEnter !== null) {
      setSendOnEnter(JSON.parse(savedSendOnEnter));
    }
  }, []);

  // Simple function to count tokens (in this case, we consider one word as one token)
  const countTokens = (text) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="bg-white p-2 sm:p-4 border-t shadow-md">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-2">
          <label className="flex items-center cursor-pointer mb-2 sm:mb-0">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={sendOnEnter} onChange={toggleSendOnEnter} />
              <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${sendOnEnter ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${sendOnEnter ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className={`ml-2 text-sm font-medium ${sendOnEnter ? 'text-blue-500' : 'text-gray-600'}`}>
              Send on Enter
            </span>
          </label>
          <span className="text-sm font-medium text-gray-600">
            Tokens: {tokenCount}
          </span>
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full p-3 pr-24 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[50px] max-h-[160px] overflow-y-auto text-sm"
            rows="1"
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-full transition-all duration-300 ease-in-out ${
                isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              type="submit"
              className={`p-2 rounded-full transition-all duration-300 ease-in-out ${
                message.trim() 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!message.trim()}
            >
              <Send size={20} className={message.trim() ? 'transform rotate-0' : 'transform -rotate-45'} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputArea;