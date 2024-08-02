// utils/modelUtils.js
export const MODEL_CONFIGS = {
    'openai/gpt-4o-mini-2024-07-18': {
      name: 'GPT-4o Mini',
      contextLength: 128000,
      inputCost: 0.15, // per 1M tokens
      outputCost: 0.6, // per 1M tokens
      imageCost: 7.225 // per 1K input images
    },
    'anthropic/claude-3.5-sonnet': {
      name: 'Claude 3.5 Sonnet',
      contextLength: 200000,
      inputCost: 3.00, // per 1M tokens
      outputCost: 15.00, // per 1M tokens
      imageCost: 4.80 // per 1K input images
  },
    'perplexity/llama-3.1-sonar-small-128k-online': {
      name: 'Llama 3.1 Sonar Small',
      contextLength: 131072,
      inputCost: 0.20, // per 1M tokens
      outputCost: 0.20, // per 1M tokens
      imageCost: 5.00 // per 1K requests
    },
    'meta-llama/llama-3.1-405b-instruct': {
      name: 'Llama 3.1 405B Instruct',
      contextLength: 131072,
      inputCost: 2.70, // per 1M tokens
      outputCost: 2.70, // per 1M tokens
      imageCost: 0 // assuming no image processing capability
    },
    'meta-llama/llama-3.1-405b': {
        name: 'Llama 3.1 405B (base)',
        contextLength: 131072,
        inputCost: 2.00, // per 1M tokens
        outputCost: 2.00, // per 1M tokens
        imageCost: 0 // assuming no image processing capability
    },
    'meta-llama/llama-2-13b-chat': {
      name: 'Llama 2 13B Chat',
      contextLength: 4096,
      inputCost: 0.025,
      outputCost: 0.075,
      imageCost: 0
    }
  };
  
  export const calculateTokenCost = (tokens, costPerMillion) => {
    return (tokens / 1000000) * costPerMillion;
  };
  
  export const calculateImageCost = (images, costPerThousand) => {
    return (images / 1000) * costPerThousand;
  };