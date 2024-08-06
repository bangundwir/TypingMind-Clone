// Sidebar/Settings.js
import React, { useState } from 'react';
import Button from '../common/Button';
import { Eye, EyeOff } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';

const Settings = ({
  models,
  selectedModel,
  onModelChange,
  apiKeys,
  setApiKeys,
  selectedApiKey,
  setSelectedApiKey,
  initialSystemInstruction,
  setInitialSystemInstruction,
  baseUrlKey,
  setBaseUrlKey,
}) => {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const toggleInitialPromptVisibility = () => setInitialSystemInstruction((prev) => !prev);
  const toggleApiKeyVisibility = () => setShowApiKey((prev) => !prev);

  return (
    <div className="space-y-6 mt-4 px-4 md:px-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="model-select">
          Select Model
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="base-url-select">
          Select Base URL
        </label>
        <select
          id="base-url-select"
          value={baseUrlKey}
          onChange={(e) => setBaseUrlKey(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <option value="openrouter">OpenRouter</option>
          <option value="together">Together AI</option>
          <option value="groq">Groq</option>
        </select>
      </div>
      
      <div>
        <Button 
          onClick={() => setIsApiKeyModalOpen(true)} 
          className="w-full mb-3 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Manage API Keys
        </Button>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold">Selected API Key</label>
            <button 
              onClick={toggleApiKeyVisibility} 
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="w-full p-2 bg-gray-800 text-white rounded-lg overflow-hidden">
            {showApiKey ? selectedApiKey : '•'.repeat(Math.min(20, selectedApiKey.length))}
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold" htmlFor="system-instruction">
            Initial System Instruction
          </label>
          <button 
            onClick={toggleInitialPromptVisibility} 
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            {initialSystemInstruction ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <Button 
          onClick={() => {}} 
          className="w-full text-sm px-4 py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Edit Instruction
        </Button>
      </div>
      
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        selectedApiKey={selectedApiKey}
        setSelectedApiKey={setSelectedApiKey}
      />
    </div>
  );
};

export default Settings;