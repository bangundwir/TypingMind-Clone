// src/hooks/useModelConfig.js
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const defaultModels = [
  { id: 'openai/gpt-4o-mini-2024-07-18', name: 'GPT-4o Mini' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'perplexity/llama-3.1-sonar-small-128k-online', name: 'perplexity/llama-3.1-sonar-small-128k-online' },
];

export const useModelConfig = () => {
  const [models] = useState(defaultModels);
  const [selectedModel, setSelectedModel] = useLocalStorage('selectedModel', defaultModels[0].id);

  const changeSelectedModel = (modelId) => {
    setSelectedModel(modelId);
  };

  return {
    models,
    selectedModel,
    changeSelectedModel,
  };
};
