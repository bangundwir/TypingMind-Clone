// hooks/useModelConfig.js
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { MODEL_CONFIGS } from '../utils/modelUtils';

export const useModelConfig = () => {
  const [models] = useState(Object.keys(MODEL_CONFIGS).map(id => ({ id, name: MODEL_CONFIGS[id].name })));
  const [selectedModel, setSelectedModel] = useLocalStorage('selectedModel', models[0].id);

  const changeSelectedModel = (modelId) => {
    setSelectedModel(modelId);
  };

  return {
    models,
    selectedModel,
    changeSelectedModel,
    modelConfig: MODEL_CONFIGS[selectedModel],
  };
};