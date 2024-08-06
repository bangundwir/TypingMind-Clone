// Sidebar/ApiKeyModal.js
import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Key, ExternalLink, Eye, EyeOff } from 'lucide-react';

const ApiKeyModal = ({ isOpen, onClose, apiKeys, setApiKeys, selectedApiKey, setSelectedApiKey }) => {
  const [inputApiKey, setInputApiKey] = useState('');
  const [apiKeyName, setApiKeyName] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    if (inputApiKey && apiKeyName) {
      setApiKeys([...apiKeys, { name: apiKeyName, key: inputApiKey }]);
      setInputApiKey('');
      setApiKeyName('');
    }
  };

  const handleSelectApiKey = (key) => {
    setSelectedApiKey(key);
    onClose();
  };

  const openRouterUrl = "https://openrouter.ai/keys";

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="API Key">
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Key size={24} className="text-yellow-400 mr-2" />
          <h2 className="text-xl font-bold">OpenRouter API Key</h2>
        </div>
        <p className="text-center">Enter your OpenRouter API Key to access AI models.</p>
        <div className="relative">
          <input
            type={showApiKey ? "text" : "password"}
            value={inputApiKey}
            onChange={(e) => setInputApiKey(e.target.value)}
            placeholder="Enter your OpenRouter API key here"
            className="w-full p-2 pr-10 bg-gray-800 text-white rounded"
          />
          <button
            onClick={toggleApiKeyVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
          >
            {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <input
          type="text"
          value={apiKeyName}
          onChange={(e) => setApiKeyName(e.target.value)}
          placeholder="Enter API key name"
          className="w-full p-2 bg-gray-800 text-white rounded mt-2"
        />
        <div className="transition-transform duration-200 hover:scale-105">
          <Button onClick={handleSave} className="w-full">
            Save API Key
          </Button>
        </div>
        <div className="text-center mt-4">
          <a 
            href={openRouterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center justify-center transition-colors duration-200"
          >
            Get OpenRouter API Key
            <ExternalLink size={16} className="ml-1" />
          </a>
        </div>
        <p className="text-xs text-center text-gray-400"> 
          Your API key is stored locally and never sent to our servers. It's used to authenticate requests to OpenRouter.
        </p>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Select an API Key</h3>
          <ul className="space-y-2 mt-2">
            {apiKeys.map(({ name, key }) => (
              <li key={key} className="flex items-center justify-between">
                <span>{name}</span>
                <Button onClick={() => handleSelectApiKey(key)} className="text-xs px-2 py-1">
                  Select
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;
