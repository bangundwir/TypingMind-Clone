import React, { useState, useEffect } from 'react';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Button from '../common/Button';
import { Send, CornerDownLeft, ToggleLeft, ToggleRight } from 'lucide-react';

const InputArea = ({ onSendMessage, onPreviewChange }) => {
  const [message, setMessage] = useState('');
  const [sendOnEnter, setSendOnEnter] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      onPreviewChange('');
    }
  };

  const handleChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (typeof onPreviewChange === 'function') {
      onPreviewChange(newMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && sendOnEnter) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleSendOnEnter = () => {
    setSendOnEnter(!sendOnEnter);
  };

  useEffect(() => {
    localStorage.setItem('sendOnEnter', JSON.stringify(sendOnEnter));
  }, [sendOnEnter]);

  useEffect(() => {
    const savedSendOnEnter = localStorage.getItem('sendOnEnter');
    if (savedSendOnEnter !== null) {
      setSendOnEnter(JSON.parse(savedSendOnEnter));
    }
  }, []);

  return (
    <div className="bg-white p-4 border-t">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="relative w-full mb-2">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
            rows="4"
          />
          <div className="absolute inset-0 pointer-events-none p-3 overflow-auto">
            <MarkdownRenderer content={message} />
          </div>
          <button
            type="submit"
            className="absolute bottom-3 right-3 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center mb-2">
          <Button
            onClick={toggleSendOnEnter}
            className={`text-xs px-3 py-2 rounded-full flex items-center space-x-2 ${
              sendOnEnter ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            {sendOnEnter ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            <span className="hidden sm:inline">Enter to Send: {sendOnEnter ? 'On' : 'Off'}</span>
            <CornerDownLeft size={16} className="sm:hidden" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;