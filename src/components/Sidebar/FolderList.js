import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import ChatList from './ChatList';
import { ChevronRight, ChevronDown } from 'lucide-react';

const FolderList = ({
  folders,
  currentChatId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onNewChat,
  currentFolderId,
  setCurrentFolderId
}) => {
  const [expandedFolders, setExpandedFolders] = useState({});
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const toggleFolderExpansion = (folderId) => {
    setExpandedFolders((prevState) => ({
      ...prevState,
      [folderId]: !prevState[folderId],
    }));
    setCurrentFolderId(folderId);  // Set the current folder ID when toggling expansion
  };

  const handleNewChatInFolder = (folderId) => {
    onNewChat(folderId);
  };

  return (
    <Droppable droppableId="folders" type="folder">
      {(provided) => (
        <div className="space-y-2 flex-grow overflow-y-auto" {...provided.droppableProps} ref={provided.innerRef}>
          {folders.map((folder) => (
            <div key={folder.id} className="mb-4">
              <div 
                className="flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 bg-gray-800"
                onClick={() => toggleFolderExpansion(folder.id)}
              >
                <span>{folder.name}</span>
                <div className="flex space-x-2">
                  {folder.id !== 'default' && (
                    <>
                      <button onClick={() => onRenameFolder(folder.id)} className="text-gray-400 hover:text-white transition-colors duration-200">✏️</button>
                      <button onClick={() => onDeleteFolder(folder.id)} className="text-gray-400 hover:text-white transition-colors duration-200">🗑️</button>
                    </>
                  )}
                  <button onClick={() => handleNewChatInFolder(folder.id)} className="text-gray-400 hover:text-white transition-colors duration-200">➕</button>
                  <button className="text-gray-400 hover:text-white transition-colors duration-200">
                    {expandedFolders[folder.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                </div>
              </div>
              {expandedFolders[folder.id] && (
                <ChatList
                  folder={folder}
                  currentChatId={currentChatId}
                  onSelectChat={onSelectChat}
                  onRenameChat={onRenameChat}
                  onDeleteChat={onDeleteChat}
                  setEditingChatId={setEditingChatId}
                  setEditingTitle={setEditingTitle}
                  editingChatId={editingChatId}
                  editingTitle={editingTitle}
                />
              )}
            </div>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default FolderList;
