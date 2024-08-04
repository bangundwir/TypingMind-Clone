import React, { useRef, useEffect, useState } from 'react';
import MarkdownRenderer from '../common/MarkdownRenderer';
import { MODEL_CONFIGS } from '../../utils/modelUtils';
import { Copy, Check, ChevronDown, ChevronUp, User, Bot, MessageSquare, Zap } from 'lucide-react';

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
        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
        title={isCopied ? "Copied!" : "Copy to clipboard"}
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <span className="text-xl sm:text-2xl font-bold text-gray-800">{modelConfig.name}</span>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Available</span>
              </div>
              <button 
                onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1"
              >
                <span className="text-sm font-medium">Model Info</span>
                {isMetricsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            {isMetricsExpanded && (
              <div className="text-sm text-gray-600 mt-4 space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
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
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="text-center p-4">
                <img src="/logo.png" alt="TypingMind" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-800">Welcome to TypingMind</h2>
                <p className="text-gray-600 text-base sm:text-lg">Start a conversation with {modelConfig.name}!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 sm:p-6 rounded-xl shadow-lg ${message.role === 'user' ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200'} max-w-full sm:max-w-3xl relative group`}>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {message.role === 'user' ? 
                          <User size={20} className="text-blue-500" /> : 
                          <Bot size={20} className="text-green-500" />
                        }
                        <p className="font-semibold text-base sm:text-lg">{message.role === 'user' ? 'You' : modelConfig.name}</p>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <p className="text-xs text-gray-500 hidden sm:inline">{new Date(message.timestamp).toLocaleString()}</p>
                        <CopyButton text={message.content} />
                      </div>
                    </div>
                    <MarkdownRenderer 
                      content={message.content} 
                      CodeBlock={({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="relative mt-4">
                            <pre {...props} className={`${className} relative overflow-x-auto p-2 sm:p-4 rounded-lg bg-gray-800 text-white text-sm sm:text-base`}>
                              <code>{children}</code>
                            </pre>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <CopyButton text={children} />
                            </div>
                          </div>
                        ) : (
                          <code className={`${className} bg-gray-100 rounded px-1 py-0.5 text-sm`} {...props}>
                            {children}
                          </code>
                        );
                      }}
                    />
                    <div className="text-xs text-gray-500 mt-3 sm:mt-4 flex flex-wrap justify-between items-center pt-2 border-t border-gray-200">
                      <span className="flex items-center space-x-1 mr-2 mb-1">
                        <MessageSquare size={14} />
                        <span>Words: {message.wordCount}</span>
                      </span>
                      <span className="flex items-center space-x-1 mr-2 mb-1">
                        <Zap size={14} />
                        <span>Tokens: {message.tokenCount}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>Cost: ${typeof message.cost === 'number' ? message.cost.toFixed(6) : 'N/A'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-center p-4 sm:p-6">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              )}
              {previewMessage && (
                <div className="p-4 sm:p-6 rounded-xl bg-yellow-50 max-w-full sm:max-w-3xl shadow-lg border border-yellow-200">
                  <p className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center">
                    <MessageSquare size={20} className="mr-2 text-yellow-500" />
                    Preview
                  </p>
                  <MarkdownRenderer content={previewMessage} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white p-3 sm:p-4 border-t shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-600">
          <p className="font-semibold mb-1 sm:mb-0 flex items-center">
            <Zap size={16} className="mr-1 text-blue-500" />
            Total Tokens: <span className="text-blue-600 ml-1">{totalTokens.toLocaleString()}</span>
          </p>
          <p className="font-semibold flex items-center">
            <span className="mr-1">💰</span>
            Total Cost: <span className="text-green-600 ml-1">${typeof totalCost === 'number' ? totalCost.toFixed(6) : 'N/A'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;