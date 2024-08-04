import React, { useRef, useEffect, useState } from 'react';
import MarkdownRenderer from '../common/MarkdownRenderer';
import { MODEL_CONFIGS } from '../../utils/modelUtils';
import { Copy, Check, ChevronDown, ChevronUp, User, Bot } from 'lucide-react';

const ChatArea = ({ 
  messages, 
  isLoading, 
  regeneratedResponses, 
  clearContextTimestamp, 
  selectedModel, 
  models,
  previewMessage,
  totalTokens,
  totalCost
}) => {
  const messagesEndRef = useRef(null);
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, regeneratedResponses, clearContextTimestamp, previewMessage]);

  const modelConfig = MODEL_CONFIGS[selectedModel];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  };

  const CopyButton = ({ text }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
      const success = await copyToClipboard(text);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    };

    return (
      <button
        onClick={handleCopy}
        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        title={isCopied ? "Copied!" : "Copy to clipboard"}
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-100">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-gray-800">{modelConfig.name}</span>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Available</span>
              </div>
              <button 
                onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {isMetricsExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            {isMetricsExpanded && (
              <div className="text-sm text-gray-600 mt-4 space-y-2 bg-gray-50 p-4 rounded-lg">
                <p><span className="font-semibold">Context:</span> {modelConfig.contextLength.toLocaleString()} tokens</p>
                <p><span className="font-semibold">Input Cost:</span> ${modelConfig.inputCost.toFixed(5)}/1M tokens</p>
                <p><span className="font-semibold">Output Cost:</span> ${modelConfig.outputCost.toFixed(5)}/1M tokens</p>
                {modelConfig.imageCost > 0 && <p><span className="font-semibold">Image Cost:</span> ${modelConfig.imageCost.toFixed(5)}/1K images</p>}
              </div>
            )}
          </div>
          {clearContextTimestamp && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md" role="alert">
              <p className="font-bold">Context Cleared</p>
              <p>The conversation context was cleared on {new Date(clearContextTimestamp).toLocaleString()}.</p>
            </div>
          )}
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-lg">
              <div className="text-center">
                <img src="/logo.png" alt="TypingMind" className="w-32 h-32 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-3 text-gray-800">Welcome to TypingMind</h2>
                <p className="text-gray-600 text-lg">Start a conversation with {modelConfig.name}!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-6 rounded-xl shadow-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-white'} max-w-3xl relative group`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        {message.role === 'user' ? <User size={24} className="text-blue-500" /> : <Bot size={24} className="text-green-500" />}
                        <p className="font-semibold text-lg">{message.role === 'user' ? 'You' : modelConfig.name}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                        <CopyButton text={message.content} />
                      </div>
                    </div>
                    <MarkdownRenderer 
                      content={message.content} 
                      CodeBlock={({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="relative mt-4">
                            <pre {...props} className={`${className} relative overflow-x-auto p-4 rounded-lg bg-gray-800 text-white`}>
                              <code>{children}</code>
                            </pre>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <CopyButton text={children} />
                            </div>
                          </div>
                        ) : (
                          <code className={`${className} bg-gray-100 rounded px-1 py-0.5`} {...props}>
                            {children}
                          </code>
                        );
                      }}
                    />
                    <div className="text-xs text-gray-500 mt-4 flex justify-between">
                      <span>Words: {message.wordCount}</span>
                      <span>Tokens: {message.tokenCount}</span>
                      <span>Cost: ${typeof message.cost === 'number' ? message.cost.toFixed(6) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-center p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              )}
              {previewMessage && (
                <div className="p-6 rounded-xl bg-yellow-100 max-w-3xl shadow-lg">
                  <p className="font-semibold mb-3 text-lg">Preview:</p>
                  <MarkdownRenderer content={previewMessage} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white p-4 border-t shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-600">
          <p className="font-semibold">Total Tokens: <span className="text-blue-600">{totalTokens.toLocaleString()}</span></p>
          <p className="font-semibold">Total Cost: <span className="text-green-600">${typeof totalCost === 'number' ? totalCost.toFixed(6) : 'N/A'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;