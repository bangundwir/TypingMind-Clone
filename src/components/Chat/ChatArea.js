// components/Chat/ChatArea.js
import React, { useRef, useEffect } from 'react';
import MarkdownRenderer from '../common/MarkdownRenderer';
import { MODEL_CONFIGS } from '../../utils/modelUtils';
import { Copy, Check } from 'lucide-react';

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
    const [isCopied, setIsCopied] = React.useState(false);

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">{modelConfig.name}</span>
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Available</span>
          </div>
          <div className="text-sm text-gray-500">
            <p>Context: {modelConfig.contextLength.toLocaleString()} tokens</p>
            <p>Input: ${modelConfig.inputCost.toFixed(3)}/1M tokens</p>
            <p>Output: ${modelConfig.outputCost.toFixed(3)}/1M tokens</p>
            {modelConfig.imageCost > 0 && <p>Images: ${modelConfig.imageCost.toFixed(3)}/1K images</p>}
          </div>
        </div>
        {clearContextTimestamp && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p className="font-bold">Context Cleared</p>
            <p>The conversation context was cleared on {new Date(clearContextTimestamp).toLocaleString()}.</p>
          </div>
        )}
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <img src="/logo.png" alt="TypingMind" className="w-24 h-24 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Welcome to TypingMind</h2>
              <p className="text-gray-600">Start a conversation with {modelConfig.name}!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-full md:max-w-3/4 relative group`}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{message.role === 'user' ? 'You' : modelConfig.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                      <CopyButton text={message.content} />
                    </div>
                  </div>
                  <MarkdownRenderer 
                    content={message.content} 
                    CodeBlock={({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative">
                          <pre {...props} className={`${className} relative`}>
                            <code>{children}</code>
                          </pre>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <CopyButton text={children} />
                          </div>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    <span>Words: {message.wordCount}</span> | 
                    <span>Tokens: {message.tokenCount}</span> | 
                    <span>Cost: ${typeof message.cost === 'number' ? message.cost.toFixed(6) : 'N/A'}</span>
                  </div>
                </div>
                {regeneratedResponses[index] && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Regenerated responses:</p>
                    {regeneratedResponses[index].map((regen, regenIndex) => (
                      <div key={regenIndex} className="p-4 rounded-lg bg-green-100 max-w-full md:max-w-3/4 mt-2 relative group">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold">{modelConfig.name} (Regenerated {regenIndex + 1})</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-xs text-gray-500">{new Date(regen.timestamp).toLocaleString()}</p>
                            <CopyButton text={regen.content} />
                          </div>
                        </div>
                        <MarkdownRenderer 
                          content={regen.content}
                          CodeBlock={({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div className="relative">
                                <pre {...props} className={`${className} relative`}>
                                  <code>{children}</code>
                                </pre>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <CopyButton text={children} />
                                </div>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }}
                        />
                        <div className="text-xs text-gray-500 mt-2">
                          <span>Words: {regen.wordCount}</span> | 
                          <span>Tokens: {regen.tokenCount}</span> | 
                          <span>Cost: ${typeof regen.cost === 'number' ? regen.cost.toFixed(6) : 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
            {previewMessage && (
              <div className="p-4 rounded-lg bg-yellow-100 max-w-full md:max-w-3/4">
                <p className="font-semibold mb-2">Preview:</p>
                <MarkdownRenderer content={previewMessage} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p>Total Tokens: {totalTokens.toLocaleString()}</p>
          <p>Total Cost: ${typeof totalCost === 'number' ? totalCost.toFixed(6) : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;