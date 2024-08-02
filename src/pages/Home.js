import React, { useState, useEffect } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useModelConfig } from '../hooks/useModelConfig';
import Sidebar from '../components/Sidebar';
import { ChatArea, InputArea } from '../components/Chat';
import Button from '../components/common/Button';
import { Menu, X, Copy, RefreshCw, Trash2, Plus, Calendar } from 'lucide-react';

const Home = () => {
  const { 
    chats, 
    currentChatId, 
    messages, 
    apiKey, 
    isLoading, 
    regeneratedResponses,
    clearContextTimestamp,
    previewMessage,
    setApiKey,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleRenameChat,
    handleRegenerate,
    handleClearContext,
    setPreviewMessage,
  } = useChatContext();

  const { models, selectedModel, changeSelectedModel } = useModelConfig();
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [areActionButtonsVisible, setAreActionButtonsVisible] = useState(true);

  const toggleApiKeyVisibility = () => setIsApiKeyVisible(!isApiKeyVisible);
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  const toggleActionButtons = () => setAreActionButtonsVisible(!areActionButtonsVisible);

  const handleCopyChat = () => {
    const chatContent = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
    navigator.clipboard.writeText(chatContent).then(() => {
      alert('Chat copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          isSidebarVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={toggleSidebar}
      ></div>
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white overflow-y-auto transition-all duration-300 ease-in-out transform ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <Sidebar 
          chats={chats} 
          currentChatId={currentChatId} 
          onNewChat={handleNewChat} 
          onSelectChat={(chatId) => {
            handleSelectChat(chatId);
            if (window.innerWidth < 768) {
              setIsSidebarVisible(false);
            }
          }}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          apiKey={apiKey}
          setApiKey={setApiKey}
          isApiKeyVisible={isApiKeyVisible}
          toggleApiKeyVisibility={toggleApiKeyVisibility}
          models={models}
          selectedModel={selectedModel}
          onModelChange={changeSelectedModel}
          onCloseSidebar={() => setIsSidebarVisible(false)}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="bg-white p-2 border-b flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            <Button onClick={toggleSidebar} className="text-xs px-2 py-1 rounded-full md:hidden">
              <Menu size={20} />
            </Button>
            <Button onClick={toggleActionButtons} className="md:hidden text-xs px-2 py-1 rounded-full">
              {areActionButtonsVisible ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar size={16} className="mr-1" />
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatArea 
            messages={messages} 
            isLoading={isLoading}
            regeneratedResponses={regeneratedResponses}
            clearContextTimestamp={clearContextTimestamp}
            selectedModel={selectedModel}
            models={models}
            previewMessage={previewMessage}
          />
        </div>
        {areActionButtonsVisible && (
          <div className="bg-white p-2 border-t flex flex-wrap justify-start items-center">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleRegenerate} className="text-xs px-3 py-2 rounded-full flex items-center">
                <RefreshCw size={16} className="mr-1" /> Regenerate
              </Button>
              <Button onClick={handleClearContext} className="text-xs px-3 py-2 rounded-full flex items-center">
                <Trash2 size={16} className="mr-1" /> Clear Context
              </Button>
              <Button onClick={handleNewChat} className="text-xs px-3 py-2 rounded-full flex items-center">
                <Plus size={16} className="mr-1" /> New Chat
              </Button>
              <Button onClick={handleCopyChat} className="text-xs px-3 py-2 rounded-full flex items-center">
                <Copy size={16} className="mr-1" /> Copy Chat
              </Button>
            </div>
          </div>
        )}
        <InputArea 
          onSendMessage={handleSendMessage}
          onPreviewChange={setPreviewMessage}
        />
      </div>
    </div>
  );
};

export default Home;