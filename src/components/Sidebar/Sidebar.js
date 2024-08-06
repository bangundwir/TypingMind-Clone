// Sidebar/Sidebar.js
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { X, ChevronRight, ChevronDown, Eye, EyeOff, Download, Upload } from 'lucide-react';
import ApiUsage from '../ApiUsage/ApiUsage';
import { DragDropContext } from 'react-beautiful-dnd';
import FolderList from './FolderList';
import Settings from './Settings';
import Templates from './Templates';

const Sidebar = ({
  folders,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  apiKeys,
  setApiKeys,
  selectedApiKey,
  setSelectedApiKey,
  baseUrlKey,
  setBaseUrlKey,
  models,
  selectedModel,
  onModelChange,
  onCloseSidebar,
  initialSystemInstruction,
  setInitialSystemInstruction,
  savedPrompts,
  setSavedPrompts,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  exportData,
  importData,
  onMoveChatToFolder,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiUsageVisible, setIsApiUsageVisible] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedData, setImportedData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState('default');
  const [folderName, setFolderName] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleKeyboardShow = () => {
      setIsKeyboardVisible(true);
    };

    const handleKeyboardHide = () => {
      setIsKeyboardVisible(false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('focusin', handleKeyboardShow);
    window.addEventListener('focusout', handleKeyboardHide);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focusin', handleKeyboardShow);
      window.removeEventListener('focusout', handleKeyboardHide);
    };
  }, []);

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleApiUsageVisibility = () => setIsApiUsageVisible(!isApiUsageVisible);

  const handleExport = () => {
    exportData();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        setImportedData(data);
        setIsImportModalOpen(true);
      };
      reader.readAsText(file);
    }
  };

  const confirmImport = () => {
    if (importedData) {
      importData(importedData);
      setIsImportModalOpen(false);
      setImportedData(null);
    }
  };

  const openCreateFolderModal = () => {
    setFolderName('');
    setIsCreateFolderModalOpen(true);
  };

  const handleCreateFolderSubmit = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName);
      setIsCreateFolderModalOpen(false);
    } else {
      alert('Folder name cannot be empty.');
    }
  };

  const openRenameFolderModal = (folderId) => {
    setCurrentFolderId(folderId);
    setFolderName(folders.find(folder => folder.id === folderId)?.name || '');
    setIsRenameFolderModalOpen(true);
  };

  const handleRenameFolderSubmit = () => {
    if (folderName.trim()) {
      onRenameFolder(currentFolderId, folderName);
      setIsRenameFolderModalOpen(false);
    } else {
      alert('Folder name cannot be empty.');
    }
  };

  const handleNewChat = () => {
    onNewChat(currentFolderId);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      onMoveChatToFolder(result.draggableId, destination.droppableId);
    }
  };

  return (
    <div className="h-full flex flex-col p-2 md:p-4 overflow-hidden relative bg-gray-900 text-white">
      {isMobile && !isKeyboardVisible && (
        <button 
          onClick={onCloseSidebar}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>
      )}
      <div className="flex flex-col space-y-2 mb-4">
        <Button onClick={handleNewChat} className="w-full text-sm py-2">
          New Chat
        </Button>
        <Button onClick={openCreateFolderModal} className="w-full text-sm py-2">
          Create Folder
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-grow overflow-y-auto">
          <FolderList
            folders={folders}
            currentChatId={currentChatId}
            onSelectChat={onSelectChat}
            onRenameChat={onRenameChat}
            onDeleteChat={onDeleteChat}
            onCreateFolder={onCreateFolder}
            onRenameFolder={openRenameFolderModal}
            onDeleteFolder={onDeleteFolder}
            onNewChat={onNewChat}
            currentFolderId={currentFolderId}
            setCurrentFolderId={setCurrentFolderId}
          />
        </div>
      </DragDropContext>
      <div className="mt-4 space-y-2">
        <button
          onClick={toggleSettings}
          className="w-full flex justify-between items-center p-2 bg-gray-800 rounded text-white text-sm"
        >
          <span>Settings</span>
          {isSettingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isSettingsOpen && (
          <Settings
            models={models}  
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            selectedApiKey={selectedApiKey}
            setSelectedApiKey={setSelectedApiKey}
            baseUrlKey={baseUrlKey}
            setBaseUrlKey={setBaseUrlKey}
            initialSystemInstruction={initialSystemInstruction}
            setInitialSystemInstruction={setInitialSystemInstruction}
          />
        )}
        <Templates
          savedPrompts={savedPrompts}
          setSavedPrompts={setSavedPrompts}
          initialSystemInstruction={initialSystemInstruction}
          setInitialSystemInstruction={setInitialSystemInstruction}
          isMobile={isMobile}
        />
        <button
          onClick={toggleApiUsageVisibility}
          className="w-full flex justify-between items-center p-2 bg-gray-800 rounded text-white text-sm"
        >
          <span>API Usage</span>
          {isApiUsageVisible ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isApiUsageVisible && <ApiUsage selectedApiKey={selectedApiKey} baseUrlKey={baseUrlKey} />}
      </div>
      <div className="mt-4 space-y-2">
        <Button onClick={handleExport} className="w-full text-sm py-2 flex items-center justify-center">
          <Download size={14} className="mr-1" /> Export Data
        </Button>
        <label className="w-full flex items-center justify-center cursor-pointer bg-gray-800 text-white p-2 rounded text-sm">
          <Upload size={14} className="mr-1" /> Import Data
          <input
            type="file"
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
        </label>
      </div>
      <Modal
        title="Confirm Import"
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm">Are you sure you want to import this data? This will overwrite existing data.</p>
          <div className="flex justify-end">
            <Button onClick={confirmImport} className="text-xs px-2 py-1">
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Create New Folder"
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          <div className="flex justify-end">
            <Button onClick={handleCreateFolderSubmit} className="text-xs px-2 py-1">
              Create
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Rename Folder"
        isOpen={isRenameFolderModalOpen}
        onClose={() => setIsRenameFolderModalOpen(false)}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter new folder name"
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          <div className="flex justify-end">
            <Button onClick={handleRenameFolderSubmit} className="text-xs px-2 py-1">
              Rename
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
