import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Key, Eye, EyeOff } from 'lucide-react';

const ApiKeyModal = ({ isOpen, onClose, apiKey, setApiKey }) => {
  const [inputApiKey, setInputApiKey] = useState(apiKey);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const handleSave = () => {
    setApiKey(inputApiKey);
    onClose();
  };

  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter API Key">
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Key size={24} className="text-yellow-400 mr-2" />
          <h2 className="text-xl font-bold">Enter API Key</h2>
        </div>
        <p className="text-center text-sm md:text-base">Your API Key is stored locally on your browser and never sent anywhere else.</p>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">OpenRouter API Key:</label>
          <div className="flex items-center">
            <span className="bg-gray-700 text-gray-300 px-2 py-2 rounded-l-md text-sm md:text-base">🔐</span>
            <div className="relative flex-grow">
              <input
                type={isApiKeyVisible ? "text" : "password"}
                value={inputApiKey.startsWith('sk-or-') ? inputApiKey.slice(6) : inputApiKey}
                onChange={(e) => setInputApiKey(`sk-or-${e.target.value}`)}
                placeholder="Enter your API key here"
                className="w-full p-2 bg-gray-800 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-sm md:text-base"
              />
              <button
                type="button"
                onClick={toggleApiKeyVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {isApiKeyVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>
        <div className="text-center">
          <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm md:text-base">
            Get API key here
          </a>
        </div>
        <Button onClick={handleSave} className="w-full text-sm md:text-base">
          Save API Key
        </Button>
        <p className="text-xs md:text-sm text-center text-gray-400">
          API Key not working? Make sure you have sufficient credits in your OpenRouter account.
        </p>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;