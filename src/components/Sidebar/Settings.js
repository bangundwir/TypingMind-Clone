import React, { useState } from 'react';
import Button from '../common/Button';
import { Eye, EyeOff } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';

const Settings = ({
  models,
  selectedModel,
  onModelChange,
  apiKey,
  setApiKey,
  initialSystemInstruction,
  setInitialSystemInstruction,
}) => {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const toggleInitialPromptVisibility = () => setInitialSystemInstruction((prev) => !prev);

  return (
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
        <Button onClick={() => setIsApiKeyModalOpen(true)} className="w-full mb-2 flex items-center justify-center">
          Enter API Key
        </Button>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold" htmlFor="system-instruction">
            Initial System Instruction
          </label>
          <button onClick={toggleInitialPromptVisibility} className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
            {initialSystemInstruction ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <Button onClick={() => {}} className="w-full text-xs px-2 py-1 flex items-center justify-center">
          Edit Instruction
        </Button>
      </div>
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
};

export default Settings;