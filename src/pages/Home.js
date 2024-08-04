import React, { useState, useEffect } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import Sidebar from '../components/Sidebar';
import { ChatArea, InputArea } from '../components/Chat';
import Button from '../components/common/Button';
import { Menu, X, Copy, RefreshCw, Trash2, Plus, Calendar, MessageCircle } from 'lucide-react';

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
    initialSystemInstruction,
    setApiKey,
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

  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [areActionButtonsVisible, setAreActionButtonsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

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
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      if (newIsDesktop) {
        setIsSidebarVisible(true);
        setAreActionButtonsVisible(true);
      } else {
        setIsSidebarVisible(false);
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
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          isSidebarVisible && !isDesktop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>
      <div 
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 max-w-full bg-gray-900 text-white overflow-y-auto transition-all duration-300 ease-in-out transform ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } ${isDesktop ? 'lg:translate-x-0' : ''}`}
      >
        <Sidebar 
          folders={folders} 
          currentChatId={currentChatId} 
          onNewChat={handleNewChat}
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
          onMoveChatToFolder={onMoveChatToFolder}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm p-3 flex justify-between items-center">
          <div className="flex space-x-3 items-center">
            <Button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
              <Menu size={24} />
            </Button>
            <Button onClick={toggleActionButtons} className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
              {areActionButtonsVisible ? <X size={24} /> : <MessageCircle size={24} />}
            </Button>
          </div>
          <div className="text-sm text-gray-500 flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <Calendar size={18} className="mr-2" />
            {new Date().toLocaleDateString()}
          </div>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">
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
          {(isDesktop || areActionButtonsVisible) && (
            <div className="bg-white p-3 border-t flex flex-wrap justify-center items-center gap-2">
              <Button onClick={handleRegenerate} className="text-sm px-4 py-2 rounded-full flex items-center bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200">
                <RefreshCw size={16} className="mr-2" /> Regenerate
              </Button>
              <Button onClick={handleClearContext} className="text-sm px-4 py-2 rounded-full flex items-center bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">
                <Trash2 size={16} className="mr-2" /> Clear Context
              </Button>
              <Button onClick={() => handleNewChat('default')} className="text-sm px-4 py-2 rounded-full flex items-center bg-green-500 text-white hover:bg-green-600 transition-colors duration-200">
                <Plus size={16} className="mr-2" /> New Chat
              </Button>
              <Button onClick={handleCopyChat} className="text-sm px-4 py-2 rounded-full flex items-center bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200">
                <Copy size={16} className="mr-2" /> Copy Chat
              </Button>
            </div>
          )}
          <InputArea 
            onSendMessage={handleSendMessage}
            onPreviewChange={setPreviewMessage}
          />
        </main>
      </div>
    </div>
  );
};

export default Home;