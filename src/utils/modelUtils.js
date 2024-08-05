// utils/modelUtils.js
export const MODEL_CONFIGS = {
  "openai/gpt-4o-mini-2024-07-18": {
    name: "GPT-4o Mini-2024-07-18",
    contextLength: 128000,
    inputCost: 0.15, // per 1M tokens
    outputCost: 0.6, // per 1M tokens
    imageCost: 7.225, // per 1K input images
  },
  "openai/gpt-4o-mini": {
    name: "GPT-4o-mini",
    contextLength: 128000,
    inputCost: 0.15, // per 1M tokens
    outputCost: 0.6, // per 1M tokens
    imageCost: 7.225, // per 1K images
  },
  "openai/gpt-4o": {
    name: "GPT-4o",
    contextLength: 128000,
    inputCost: 5, // per 1M tokens
    outputCost: 15, // per 1M tokens
    imageCost: 7.225, // per 1K images
  },
  "anthropic/claude-3.5-sonnet": {
    name: "Claude 3.5 Sonnet",
    contextLength: 200000,
    inputCost: 3.0, // per 1M tokens
    outputCost: 15.0, // per 1M tokens
    imageCost: 4.8, // per 1K input images
  },
  "anthropic/claude-3-haiku": {
    name: "Claude 3 Haiku",
    contextLength: 200000,
    inputCost: 0.25, // per 1M tokens
    outputCost: 1.25, // per 1M tokens
    imageCost: 0.4, // per 1K images
  },
  "perplexity/llama-3.1-sonar-small-128k-online": {
    name: "Llama 3.1 Sonar Small",
    contextLength: 131072,
    inputCost: 0.2, // per 1M tokens
    outputCost: 0.2, // per 1M tokens
    imageCost: 5.0, // per 1K requests
  },
  "meta-llama/llama-3.1-405b-instruct": {
    name: "Llama 3.1 405B Instruct",
    contextLength: 131072,
    inputCost: 2.7, // per 1M tokens
    outputCost: 2.7, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },
  "meta-llama/llama-3.1-405b": {
    name: "Llama 3.1 405B (base)",
    contextLength: 131072,
    inputCost: 2.0, // per 1M tokens
    outputCost: 2.0, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },
  "gryphe/mythomax-l2-13b": {
    name: "MythoMax 13B",
    contextLength: 4096,
    inputCost: 0.1, // per 1M tokens
    outputCost: 0.1, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },
  "meta-llama/llama-3.1-8b-instruct:free": {
    name: "Llama 3.1 8B Instruct (free)",
    contextLength: 131072,
    inputCost: 0, // per 1M tokens
    outputCost: 0, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },
  "google/gemma-2-9b-it:free": {
    name: "Gemma 2 9B (free)",
    contextLength: 8192,
    inputCost: 0, // per 1M tokens
    outputCost: 0, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },
  'google/gemma-2-9b-it': {
    name: 'Gemma 2 9B',
    contextLength: 8192,
    inputCost: 0.08, // per 1M tokens
    outputCost: 0.08, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
  "qwen/qwen-2-7b-instruct:free": {
    name: "Qwen 2 7B Instruct (free)",
    contextLength: 32768,
    inputCost: 0, // per 1M tokens
    outputCost: 0, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },
  "microsoft/phi-3-medium-128k-instruct:free": {
    name: "Phi-3 Medium 128K Instruct (free)",
    contextLength: 128000,
    inputCost: 0, // per 1M tokens
    outputCost: 0, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },
  "meta-llama/llama-3.1-70b-instruct": {
    name: "Llama 3.1 70B Instruct",
    contextLength: 131072,
    inputCost: 0.52, // per 1M tokens
    outputCost: 0.75, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },

  "anthropic/claude-3.5-sonnet:beta": {
    name: "Claude 3.5 Sonnet (self-moderated)",
    contextLength: 200000,
    inputCost: 3, // per 1M tokens
    outputCost: 15, // per 1M tokens
    imageCost: 4.8, // per 1K images
  },

  "mistralai/mistral-7b-instruct": {
    name: "Mistral 7B Instruct",
    contextLength: 32768,
    inputCost: 0.059, // per 1M tokens
    outputCost: 0.059, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },

  "perplexity/llama-3.1-sonar-large-128k-chat": {
    name: "Llama 3.1 Sonar 70B",
    contextLength: 131072,
    inputCost: 1, // per 1M tokens
    outputCost: 1, // per 1M tokens
    imageCost: 0, // assuming no image processing capability
  },

  "perplexity/llama-3.1-sonar-large-128k-online": {
    name: "Llama 3.1 Sonar 70B Online",
    contextLength: 131072,
    inputCost: 1, // per 1M tokens
    outputCost: 1, // per 1M tokens
    imageCost: 5, // per 1K requests
  },
  '01-ai/yi-large-turbo': {
    name: 'Yi Large Turbo',
    contextLength: 4096,
    inputCost: 0.19, // per 1M tokens
    outputCost: 0.19, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
  'mistralai/mistral-nemo': {
    name: 'Mistral Nemo',
    contextLength: 128000,
    inputCost: 0.17, // per 1M tokens
    outputCost: 0.17, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
  'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo': {
    name: 'TogetherAI-Meta-Llama-3.1-8B-Instruct-Turbo',
    contextLength: 128000,
    inputCost: 0.18, // per 1M tokens
    outputCost: 0.18, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
  'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo': {
    name: 'TogetherAI-Meta-Llama-3.1-70B-Instruct-Turbo',
    contextLength: 128000,
    inputCost: 0.88, // per 1M tokens
    outputCost: 0.88, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
  'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo': {
    name: 'TogetherAI-Meta-Llama-3.1-405B-Instruct-Turbo',
    contextLength: 128000,
    inputCost: 5, // per 1M tokens
    outputCost: 5, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
  'llama-3.1-70b-versatile': {
    name: 'Groq llama-3.1-70b-versatile',
    contextLength: 131072,
    inputCost: 0.17, // per 1M tokens
    outputCost: 0.17, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
  'llama-3.1-405b-reasoning': {
    name: 'Groq llama-3.1-405b-reasoning',
    contextLength: 131072,
    inputCost: 0.17, // per 1M tokens
    outputCost: 0.17, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
  'llama-3.1-8b-instant': {
    name: 'Groq llama-3.1-8b-instant',
    contextLength: 131072,
    inputCost: 0.17, // per 1M tokens
    outputCost: 0.17, // per 1M tokens
    imageCost: 0 // assuming no image processing capability
  },
};

export const calculateTokenCost = (tokens, costPerMillion) => {
  return (tokens / 1000000) * costPerMillion;
};

export const calculateImageCost = (images, costPerThousand) => {
  return (images / 1000) * costPerThousand;
};
