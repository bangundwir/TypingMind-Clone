// pages/Home.js
import React, { useState, useEffect } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import Sidebar from '../components/Sidebar';
import { ChatArea, InputArea } from '../components/Chat';
import Button from '../components/common/Button';
import { Menu, X, Copy, RefreshCw, Trash2, Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const { 
    folders, 
    currentChatId, 
    messages, 
    apiKey, 
    isLoading, 
    regeneratedResponses,
    clearContextTimestamp,
    previewMessage,
    selectedModel,
    models,
    modelConfig,
    initialSystemInstruction,
    setApiKey,
    handleSendMessage,
    handleNewChat,  // Ensure handleNewChat is defined here
    handleSelectChat,
    handleDeleteChat,
    handleRenameChat,
    handleRegenerate,
    handleClearContext,
    setPreviewMessage,
    changeSelectedModel,
    setInitialSystemInstruction,
    savedPrompts,
    setSavedPrompts,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
    exportData,
    importData,
  } = useChatContext();

  const [isApiKeyVisible, setIsApiKeyVisible] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [areActionButtonsVisible, setAreActionButtonsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

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
      const newIsDesktop = window.innerWidth >= 768;
      setIsDesktop(newIsDesktop);
      if (newIsDesktop) {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultFolder = folders?.find(folder => folder.id === 'default') || { chats: [] };
  const currentChat = folders?.flatMap(folder => folder.chats).find(chat => chat.id === currentChatId) || defaultFolder.chats[0];
  const totalTokens = currentChat ? currentChat.totalTokens : 0;
  const totalCost = currentChat ? currentChat.totalCost : 0;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {!isDesktop && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
            isSidebarVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        ></div>
      )}
      <div 
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white overflow-y-auto transition-all duration-300 ease-in-out transform ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } ${isDesktop ? 'md:translate-x-0' : ''}`}
      >
        <Sidebar 
          folders={folders} 
          currentChatId={currentChatId} 
          onNewChat={handleNewChat}  // Pass handleNewChat to Sidebar
          onSelectChat={(chatId) => {
            handleSelectChat(chatId);
            if (!isDesktop) {
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
          onCloseSidebar={() => !isDesktop && setIsSidebarVisible(false)}
          initialSystemInstruction={initialSystemInstruction}
          setInitialSystemInstruction={setInitialSystemInstruction}
          savedPrompts={savedPrompts}
          setSavedPrompts={setSavedPrompts}
          onCreateFolder={handleCreateFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          exportData={exportData}
          importData={importData}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="bg-white p-2 border-b flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            {isDesktop ? (
              <Button onClick={toggleSidebar} className="text-xs px-2 py-1 rounded-full">
                {isSidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </Button>
            ) : (
              <Button onClick={toggleSidebar} className="text-xs px-2 py-1 rounded-full">
                <Menu size={20} />
              </Button>
            )}
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
            totalTokens={totalTokens}
            totalCost={totalCost}
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
