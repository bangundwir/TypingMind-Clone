import React, { useState } from 'react';
import Button from '../common/Button';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

const Sidebar = ({ 
  chats, 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat, 
  onRenameChat,
  apiKey,
  setApiKey,
  isApiKeyVisible,
  toggleApiKeyVisibility,
  models,
  selectedModel,
  onModelChange,
  onCloseSidebar
}) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleRenameClick = (chat, event) => {
    event.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleRenameSubmit = (chatId) => {
    onRenameChat(chatId, editingTitle);
    setEditingChatId(null);
  };

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden relative">
      <button 
        onClick={onCloseSidebar}
        className="md:hidden absolute top-2 right-2 text-white hover:text-gray-300"
      >
        <X size={24} />
      </button>
      <Button onClick={onNewChat} className="w-full mb-4">
        New Chat
      </Button>
      <div className="space-y-2 flex-grow overflow-y-auto">
        {chats.map(chat => (
          <div 
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 ${
              chat.id === currentChatId ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            {editingChatId === chat.id ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => handleRenameSubmit(chat.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit(chat.id)}
                className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <div className="flex items-center space-x-2 flex-grow truncate">
                  <span className="text-xl">💬</span>
                  <span className="truncate">{chat.title}</span>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button onClick={(e) => handleRenameClick(chat, e)} className="text-gray-400 hover:text-white transition-colors duration-200">✏️</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }} className="text-gray-400 hover:text-white transition-colors duration-200">🗑️</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={toggleSettings}
          className="w-full flex justify-between items-center p-2 bg-gray-800 rounded text-white mb-2"
        >
          <span>Settings</span>
          {isSettingsOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        {isSettingsOpen && (
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="model-select">
                Select Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">API Key</span>
                <button onClick={toggleApiKeyVisibility} className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  {isApiKeyVisible ? 'Hide' : 'Show'}
                </button>
              </div>
              {isApiKeyVisible && (
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full p-2 bg-gray-800 text-white rounded"
                />
              )}
            </div>
          </div>
        )}
        <div className="mt-4 text-sm">
          <p className="text-gray-400">Chat App v2.0</p>
          <p className="text-gray-400">© 2024 YourCompany</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;