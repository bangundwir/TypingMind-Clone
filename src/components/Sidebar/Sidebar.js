// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { X, ChevronRight, ChevronDown, Eye, EyeOff, Save, Plus, Trash2, Edit3, Download, Upload } from 'lucide-react';
import ApiUsage from '../ApiUsage/ApiUsage';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  onMoveChatToFolder, // Function passed as a prop
}) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiUsageVisible, setIsApiUsageVisible] = useState(false);
  const [isInitialPromptVisible, setIsInitialPromptVisible] = useState(true);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [activePromptId, setActivePromptId] = useState('');
  const [isPromptDropdownOpen, setIsPromptDropdownOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderModalMode, setFolderModalMode] = useState('add');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedData, setImportedData] = useState(null);

  const handleRenameClick = (chat, event) => {
    event.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleRenameSubmit = (chatId) => {
    onRenameChat(chatId, editingTitle);
    setEditingChatId(null);
  };

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleApiUsageVisibility = () => setIsApiUsageVisible(!isApiUsageVisible);
  const toggleInitialPromptVisibility = () => setIsInitialPromptVisible(!isInitialPromptVisible);
  const togglePromptDropdown = () => setIsPromptDropdownOpen(!isPromptDropdownOpen);

  const handleSavePrompt = () => {
    if (currentPrompt.trim() !== '') {
      const newPrompt = {
        id: Date.now().toString(),
        name: newTemplateName || `Template ${savedPrompts.length + 1}`,
        content: currentPrompt
      };
      setSavedPrompts([...savedPrompts, newPrompt]);
      setIsModalOpen(false);
    }
  };

  const handleCreateTemplate = () => {
    setModalMode('add');
    setCurrentPrompt('');
    setNewTemplateName('');
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template) => {
    setModalMode('edit');
    setCurrentPrompt(template.content);
    setNewTemplateName(template.name);
    setIsModalOpen(true);
  };

  const handleSelectTemplate = (template) => {
    setInitialSystemInstruction(template.content);
    setActivePromptId(template.id);
  };

  const handleDeleteTemplate = (templateId, event) => {
    event.stopPropagation();
    setSavedPrompts(savedPrompts.filter(template => template.id !== templateId));
    if (activePromptId === templateId) {
      setInitialSystemInstruction('');
      setActivePromptId('');
    }
  };

  const handleSaveFolder = () => {
    if (newFolderName.trim() !== '') {
      if (folderModalMode === 'add') {
        onCreateFolder(newFolderName);
      } else if (folderModalMode === 'edit') {
        onRenameFolder(editingFolderId, newFolderName);
      }
      setIsFolderModalOpen(false);
      setNewFolderName('');
    }
  };

  const handleCreateFolder = () => {
    setFolderModalMode('add');
    setNewFolderName('');
    setIsFolderModalOpen(true);
  };

  const handleEditFolder = (folder) => {
    setFolderModalMode('edit');
    setNewFolderName(folder.name);
    setEditingFolderId(folder.id);
    setIsFolderModalOpen(true);
  };

  const handleDeleteFolder = (folderId) => {
    onDeleteFolder(folderId);
  };

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

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId !== source.droppableId || destination.index !== source.index) {
      onMoveChatToFolder(draggableId, destination.droppableId);
    }
  };

  const toggleFolderExpansion = (folderId) => {
    setExpandedFolders(prevState => ({
      ...prevState,
      [folderId]: !prevState[folderId],
    }));
  };

  const handleNewChatInFolder = (folderId) => {
    onNewChat(folderId);
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
      <Button onClick={handleCreateFolder} className="w-full mb-4">
        Create Folder
      </Button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="folders" type="folder">
          {(provided) => (
            <div className="space-y-2 flex-grow overflow-y-auto" {...provided.droppableProps} ref={provided.innerRef}>
              {folders.map((folder, index) => (
                <div key={folder.id} className="mb-4">
                  <div 
                    className="flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 bg-gray-800"
                    onClick={() => toggleFolderExpansion(folder.id)}
                  >
                    <span>{folder.name}</span>
                    <div className="flex space-x-2">
                      {folder.id !== 'default' && (
                        <>
                          <button onClick={() => handleEditFolder(folder)} className="text-gray-400 hover:text-white transition-colors duration-200">✏️</button>
                          <button onClick={() => handleDeleteFolder(folder.id)} className="text-gray-400 hover:text-white transition-colors duration-200">🗑️</button>
                        </>
                      )}
                      <button onClick={() => handleNewChatInFolder(folder.id)} className="text-gray-400 hover:text-white transition-colors duration-200">➕</button>
                      <button className="text-gray-400 hover:text-white transition-colors duration-200">
                        {expandedFolders[folder.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </div>
                  </div>
                  {expandedFolders[folder.id] && (
                    <Droppable droppableId={folder.id} type="chat">
                      {(provided) => (
                        <div className="ml-4 space-y-2" {...provided.droppableProps} ref={provided.innerRef}>
                          {(folder.chats || []).map((chat, index) => (
                            <Draggable key={chat.id} draggableId={chat.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => onSelectChat(chat.id)}
                                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 ${
                                    chat.id === currentChatId ? 'bg-gray-700' : 'hover:bg-gray-800'
                                  }`}
                                >
                                  {editingChatId === chat.id ? (
                                    <input
                                      type="text"
                                      value={editingTitle}
                                      onChange={(e) => setEditingTitle(e.target.value)}
                                      onBlur={() => handleRenameSubmit(chat.id)}
                                      onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit(chat.id)}
                                      className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <>
                                      <div className="flex items-center space-x-2 flex-grow truncate">
                                        <span className="text-xl">💬</span>
                                        <span className="truncate">{chat.title}</span>
                                      </div>
                                      <div className="flex space-x-2 flex-shrink-0">
                                        <button onClick={(e) => handleRenameClick(chat, e)} className="text-gray-400 hover:text-white transition-colors duration-200">✏️</button>
                                        <button onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteChat(chat.id);
                                        }} className="text-gray-400 hover:text-white transition-colors duration-200">🗑️</button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
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
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="model-select">
                Select Model
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">API Key</span>
                <button onClick={toggleApiKeyVisibility} className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  {isApiKeyVisible ? 'Hide' : 'Show'}
                </button>
              </div>
              {isApiKeyVisible && (
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full p-2 bg-gray-800 text-white rounded"
                />
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold" htmlFor="system-instruction">
                  Initial System Instruction
                </label>
                <button onClick={toggleInitialPromptVisibility} className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  {isInitialPromptVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button onClick={handleCreateTemplate} className="w-full text-xs px-2 py-1 flex items-center justify-center">
                <Plus size={14} className="mr-1" /> Create Template
              </Button>
              <div className="mt-2 relative">
                <Button onClick={togglePromptDropdown} className="w-full text-xs px-2 py-1 flex items-center justify-center bg-gray-800 text-white rounded">
                  {isPromptDropdownOpen ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />} 
                  Initial Prompts
                </Button>
                {isPromptDropdownOpen && (
                  <div className="absolute z-10 w-full bg-gray-800 rounded mt-2">
                    {savedPrompts.map((template) => (
                      <div
                        key={template.id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 ${
                          template.id === activePromptId ? 'bg-gray-600' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <span className="flex-grow truncate">{template.name}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTemplate(template);
                            }}
                            className="text-gray-400 hover:text-white transition-colors duration-200"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id, e);
                            }}
                            className="text-gray-400 hover:text-white transition-colors duration-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={toggleApiUsageVisibility}
              className="w-full flex justify-between items-center p-2 bg-gray-800 rounded text-white"
            >
              <span>API Usage</span>
              {isApiUsageVisible ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {isApiUsageVisible && <ApiUsage apiKey={apiKey} />}
          </div>
        )}
        <div className="mt-4 text-sm">
          <p className="text-gray-400">Chat App v2.0</p>
          <p className="text-gray-400">© 2024 YourCompany</p>
        </div>
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
      <Modal 
        title={modalMode === 'add' ? 'Add New Prompt' : 'Edit Prompt'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="template-name">
              Template Name
            </label>
            <input
              id="template-name"
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="w-full p-2 bg-gray-800 text-white rounded mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="template-content">
              Template Content
            </label>
            <textarea
              id="template-content"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Enter template content"
              className="w-full p-2 bg-gray-800 text-white rounded"
              rows="4"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSavePrompt} className="text-xs px-2 py-1">
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <Modal 
        title={folderModalMode === 'add' ? 'Add New Folder' : 'Edit Folder'}
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="folder-name">
              Folder Name
            </label>
            <input
              id="folder-name"
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full p-2 bg-gray-800 text-white rounded mb-2"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveFolder} className="text-xs px-2 py-1">
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
