import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Key, ExternalLink, Eye, EyeOff } from 'lucide-react';

const ApiKeyModal = ({ isOpen, onClose, apiKey, setApiKey }) => {
  const [inputApiKey, setInputApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    setApiKey(inputApiKey);
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
        <div className="text-center">
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
        <div className="transition-transform duration-200 hover:scale-105">
          <Button onClick={handleSave} className="w-full">
            Save API Key
          </Button>
        </div>
        <p className="text-xs text-center text-gray-400"> 
          Your API key is stored locally and never sent to our servers. It's used to authenticate requests to OpenRouter.
        </p>
        <div className="flex justify-center space-x-2">
          <div className="transition-transform duration-200 hover:scale-105">
            <Button 
              onClick={() => window.open(openRouterUrl, '_blank')}
              className="text-xs px-2 py-1 flex items-center"
            >
              Manage API Key <ExternalLink size={12} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;