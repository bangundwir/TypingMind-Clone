// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { X, ChevronRight, ChevronDown, Eye, EyeOff, Download, Upload } from 'lucide-react';
import ApiUsage from '../ApiUsage/ApiUsage';
import { DragDropContext } from 'react-beautiful-dnd';
import ChatList from './ChatList';
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
  apiKey,
  setApiKey,
  isApiKeyVisible,
  toggleApiKeyVisibility,
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

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden relative bg-gray-900 text-white">
      <button 
        onClick={onCloseSidebar}
        className="md:hidden absolute top-2 right-2 text-gray-400 hover:text-gray-200"
      >
        <X size={24} />
      </button>
      <Button onClick={() => onNewChat('default')} className="w-full mb-4">
        New Chat
      </Button>
      <Button onClick={() => onCreateFolder()} className="w-full mb-4">
        Create Folder
      </Button>
      <DragDropContext onDragEnd={(result) => onMoveChatToFolder(result.draggableId, result.destination.droppableId)}>
        <FolderList
          folders={folders}
          currentChatId={currentChatId}
          onSelectChat={onSelectChat}
          onRenameChat={onRenameChat}
          onDeleteChat={onDeleteChat}
          onCreateFolder={onCreateFolder}
          onRenameFolder={onRenameFolder}
          onDeleteFolder={onDeleteFolder}
          onNewChat={onNewChat}
        />
      </DragDropContext>
      <div className="mt-4">
        <button
          onClick={toggleSettings}
          className="w-full flex justify-between items-center p-2 bg-gray-800 rounded text-white mb-2"
        >
          <span>Settings</span>
          {isSettingsOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        {isSettingsOpen && (
          <Settings
            models={models}
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            apiKey={apiKey}
            setApiKey={setApiKey}
            isApiKeyVisible={isApiKeyVisible}
            toggleApiKeyVisibility={toggleApiKeyVisibility}
            initialSystemInstruction={initialSystemInstruction}
            setInitialSystemInstruction={setInitialSystemInstruction}
          />
        )}
        <Templates
          savedPrompts={savedPrompts}
          setSavedPrompts={setSavedPrompts}
          initialSystemInstruction={initialSystemInstruction}
          setInitialSystemInstruction={setInitialSystemInstruction}
        />
        <button
          onClick={toggleApiUsageVisibility}
          className="w-full flex justify-between items-center p-2 bg-gray-800 rounded text-white"
        >
          <span>API Usage</span>
          {isApiUsageVisible ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        {isApiUsageVisible && <ApiUsage apiKey={apiKey} />}
      </div>
      <div className="mt-4">
        <Button onClick={handleExport} className="w-full mb-2 flex items-center justify-center">
          <Download size={16} className="mr-1" /> Export Data
        </Button>
        <label className="w-full flex items-center justify-center cursor-pointer mb-2 bg-gray-800 text-white p-2 rounded">
          <Upload size={16} className="mr-1" /> Import Data
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
          <p>Are you sure you want to import this data? This will overwrite existing data.</p>
          <div className="flex justify-end">
            <Button onClick={confirmImport} className="text-xs px-2 py-1">
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
