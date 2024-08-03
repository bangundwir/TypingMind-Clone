// src/components/Sidebar/ChatList.js
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const ChatList = ({
  folder,
  currentChatId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  setEditingChatId,
  setEditingTitle,
  editingChatId,
  editingTitle,
}) => {
  const handleRenameClick = (chat, event) => {
    event.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleRenameSubmit = (chatId) => {
    onRenameChat(chatId, editingTitle);
    setEditingChatId(null);
  };

  return (
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
  );
};

export default ChatList;
