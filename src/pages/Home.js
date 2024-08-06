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
    apiKeys, 
    selectedApiKey, 
    isLoading, 
    regeneratedResponses,
    clearContextTimestamp,
    previewMessage,
    selectedModel,
    models,
    modelConfig,
    initialSystemInstruction,
    setApiKeys,
    setSelectedApiKey,
    baseUrlKey,
    setBaseUrlKey,
    handleSendMessage,
    handleNewChat,
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
    onMoveChatToFolder,
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
    navigator.clipboard.writeText(chatContent)
      .then(() => alert('Chat copied to clipboard!'))
      .catch(err => console.error('Could not copy text: ', err));
  };

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 768;
      setIsDesktop(newIsDesktop);
      if (newIsDesktop) setIsSidebarVisible(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultFolder = folders?.find(folder => folder.id === 'default') || { chats: [] };
  const currentChat = folders?.flatMap(folder => folder.chats).find(chat => chat.id === currentChatId) || defaultFolder.chats[0];
  const totalTokens = currentChat?.totalTokens || 0;
  const totalCost = currentChat?.totalCost || 0;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Overlay for mobile sidebar */}
      {!isDesktop && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
            isSidebarVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white overflow-y-auto transition-all duration-300 ease-in-out transform ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } ${isDesktop ? 'md:translate-x-0' : ''}`}
      >
        <Sidebar 
          folders={folders} 
          currentChatId={currentChatId} 
          onNewChat={handleNewChat}
          onSelectChat={(chatId) => {
            handleSelectChat(chatId);
            if (!isDesktop) setIsSidebarVisible(false);
          }}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          selectedApiKey={selectedApiKey}
          setSelectedApiKey={setSelectedApiKey}
          baseUrlKey={baseUrlKey}
          setBaseUrlKey={setBaseUrlKey}
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
          onMoveChatToFolder={onMoveChatToFolder}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white p-2 border-b flex justify-between items-center shadow-sm">
          <div className="flex space-x-2 items-center">
            <Button 
              onClick={toggleSidebar} 
              className="text-xs px-2 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              {isDesktop ? 
                (isSidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />) : 
                <Menu size={20} />
              }
            </Button>
            <Button 
              onClick={toggleActionButtons} 
              className="md:hidden text-xs px-2 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              {areActionButtonsVisible ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar size={16} className="mr-1" />
            {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* Chat Area */}
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

        {/* Action Buttons */}
        {areActionButtonsVisible && (
          <div className="bg-white p-4 border-t shadow-sm">
            <div className="max-w-4xl mx-auto flex justify-center space-x-2 sm:space-x-4">
              <ActionButton onClick={handleRegenerate} icon={<RefreshCw size={16} />} text="Regenerate" />
              <ActionButton onClick={handleClearContext} icon={<Trash2 size={16} />} text="Clear Context" />
              <ActionButton onClick={() => handleNewChat('default')} icon={<Plus size={16} />} text="New Chat" />
              <ActionButton onClick={handleCopyChat} icon={<Copy size={16} />} text="Copy Chat" />
            </div>
          </div>
        )}

        {/* Input Area */}
        <InputArea 
          onSendMessage={handleSendMessage}
          onPreviewChange={setPreviewMessage}
        />
      </div>
    </div>
  );
};

// Helper component for action buttons
const ActionButton = ({ onClick, icon, text }) => (
  <Button 
    onClick={onClick} 
    className="text-xs px-3 py-2 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
  >
    {React.cloneElement(icon, { className: "mr-1" })} {text}
  </Button>
);

export default Home;
