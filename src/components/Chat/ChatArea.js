import React, { useRef, useEffect } from 'react';
import MarkdownRenderer from '../common/MarkdownRenderer';

const ChatArea = ({ 
  messages, 
  isLoading, 
  regeneratedResponses, 
  clearContextTimestamp, 
  selectedModel, 
  models,
  previewMessage
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, regeneratedResponses, clearContextTimestamp, previewMessage]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">{models.find(m => m.id === selectedModel)?.name || selectedModel}</span>
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Available</span>
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            {new Date().toLocaleDateString()}
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
              <p className="text-gray-600">Start a conversation with {models.find(m => m.id === selectedModel)?.name || selectedModel}!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-full md:max-w-3/4`}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{message.role === 'user' ? 'You' : models.find(m => m.id === selectedModel)?.name || selectedModel}</p>
                    <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                  </div>
                  <MarkdownRenderer content={message.content} />
                  <div className="text-xs text-gray-500 mt-2">
                    <span>Words: {message.wordCount}</span> | <span>Tokens: {message.tokenCount}</span>
                  </div>
                </div>
                {regeneratedResponses[index] && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Regenerated responses:</p>
                    {regeneratedResponses[index].map((regen, regenIndex) => (
                      <div key={regenIndex} className="p-4 rounded-lg bg-green-100 max-w-full md:max-w-3/4 mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold">{models.find(m => m.id === selectedModel)?.name || selectedModel} (Regenerated {regenIndex + 1})</p>
                          <p className="text-xs text-gray-500">{new Date(regen.timestamp).toLocaleString()}</p>
                        </div>
                        <MarkdownRenderer content={regen.content} />
                        <div className="text-xs text-gray-500 mt-2">
                          <span>Words: {regen.wordCount}</span> | <span>Tokens: {regen.tokenCount}</span>
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
      </div>
    </div>
  );
};

export default ChatArea;