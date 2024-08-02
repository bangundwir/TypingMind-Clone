// src/services/api.js
import OpenAI from 'openai';

export const createChatCompletion = async (messages, apiKey, modelId) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "HTTP-Referer": window.location.origin,
      "X-Title": "Chat App",
    },
  });

  try {
    const completion = await openai.chat.completions.create({
      model: modelId,
      messages: messages.map(({ role, content }) => ({ role, content })),
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No choices returned from the API');
    }

    return completion.choices[0].message;
  } catch (error) {
    console.error("Error in createChatCompletion:", error);
    if (error.response) {
      console.error("API response:", error.response.data);
    }
    throw new Error(`Failed to get chat completion: ${error.message}`);
  }
};