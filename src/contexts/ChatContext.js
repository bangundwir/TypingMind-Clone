// src/contexts/ChatContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createChatCompletion, fetchApiUsage } from '../services/api';
import { countWords, estimateTokens } from '../utils/textUtils';
import { useModelConfig } from '../hooks/useModelConfig';
import { calculateTokenCost, calculateImageCost } from '../utils/modelUtils';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [folders, setFolders] = useLocalStorage('folders', [{ id: 'default', name: 'Default', chats: [] }]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [apiKeys, setApiKeys] = useLocalStorage('apiKeys', []); // Menyimpan API keys dengan nama
  const [selectedApiKey, setSelectedApiKey] = useLocalStorage('selectedApiKey', ''); // API key yang dipilih
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratedResponses, setRegeneratedResponses] = useState({});
  const [clearContextTimestamp, setClearContextTimestamp] = useState(null);
  const [previewMessage, setPreviewMessage] = useState('');
  const [initialSystemInstruction, setInitialSystemInstruction] = useLocalStorage('initialSystemInstruction', '');
  const [savedPrompts, setSavedPrompts] = useLocalStorage('savedPrompts', []);
  const [baseUrlKey, setBaseUrlKey] = useLocalStorage('baseUrlKey', 'openrouter');

  const { models, selectedModel, changeSelectedModel, modelConfig } = useModelConfig();

  useEffect(() => {
    if (folders.length > 0 && !currentChatId) {
      const defaultFolder = folders.find(folder => folder.id === 'default');
      if (defaultFolder.chats.length > 0) {
        setCurrentChatId(defaultFolder.chats[0].id);
      }
    }
  }, [folders, currentChatId]);

  useEffect(() => {
    if (currentChatId) {
      const currentChat = folders.flatMap(folder => folder.chats).find(chat => chat.id === currentChatId);
      if (currentChat) {
        setMessages(currentChat.messages);
        setRegeneratedResponses({});
        setClearContextTimestamp(currentChat.clearContextTimestamp || null);
      }
    }
  }, [currentChatId, folders]);

  const handleSendMessage = async (message) => {
    if (!selectedApiKey) {
      alert('Please select your API key');
      return;
    }

    const inputTokens = estimateTokens(message);
    const inputCost = calculateTokenCost(inputTokens, modelConfig.inputCost);

    const newMessage = { 
      role: 'user', 
      content: message, 
      timestamp: new Date().toISOString(),
      wordCount: countWords(message),
      tokenCount: inputTokens,
      cost: inputCost
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const relevantMessages = clearContextTimestamp
        ? updatedMessages.filter(msg => new Date(msg.timestamp) > new Date(clearContextTimestamp))
        : updatedMessages;

      const messagesWithSystemInstruction = initialSystemInstruction
        ? [{ role: 'system', content: initialSystemInstruction }, ...relevantMessages]
        : relevantMessages;

      const response = await createChatCompletion(messagesWithSystemInstruction, selectedApiKey, selectedModel, false, null, baseUrlKey);

      const outputTokens = estimateTokens(response.content);
      const outputCost = calculateTokenCost(outputTokens, modelConfig.outputCost);

      const assistantMessage = { 
        role: 'assistant', 
        content: response.content,
        timestamp: new Date().toISOString(),
        wordCount: countWords(response.content),
        tokenCount: outputTokens,
        cost: outputCost
      };
      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);

      const totalTokens = inputTokens + outputTokens;
      const totalCost = inputCost + outputCost;

      const updatedFolders = folders.map(folder => ({
        ...folder,
        chats: folder.chats.map(chat => 
          chat.id === currentChatId ? { 
            ...chat, 
            messages: newMessages,
            totalTokens: (chat.totalTokens || 0) + totalTokens,
            totalCost: (chat.totalCost || 0) + totalCost
          } : chat
        )
      }));

      if (updatedMessages.length === 1 && folders.flatMap(folder => folder.chats).find(chat => chat.id === currentChatId)?.title === 'New Chat') {
        const chatToUpdate = updatedFolders.flatMap(folder => folder.chats).find(chat => chat.id === currentChatId);
        if (chatToUpdate) {
          chatToUpdate.title = response.content.split('\n')[0].slice(0, 30) + '...';
        }
      }

      setFolders(updatedFolders);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      alert(`An error occurred while sending the message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = (folderId) => {
    const newChatId = Date.now().toString();
    const newChat = { id: newChatId, title: 'New Chat', messages: [], totalTokens: 0, totalCost: 0 };
    const updatedFolders = folders.map(folder =>
      folder.id === folderId ? { ...folder, chats: [newChat, ...folder.chats] } : folder
    );
    setFolders(updatedFolders);
    setCurrentChatId(newChatId);
    setMessages([]);
    setRegeneratedResponses({});
    setClearContextTimestamp(null);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId) => {
    const updatedFolders = folders.map(folder => ({
      ...folder,
      chats: folder.chats.filter(chat => chat.id !== chatId)
    }));
    setFolders(updatedFolders);
    const defaultFolder = updatedFolders.find(folder => folder.id === 'default');
    if (chatId === currentChatId) {
      setCurrentChatId(defaultFolder?.chats[0]?.id || null);
      setMessages(defaultFolder?.chats[0]?.messages || []);
      setRegeneratedResponses({});
      setClearContextTimestamp(defaultFolder?.clearContextTimestamp || null);
    }
  };

  const handleRenameChat = (chatId, newTitle) => {
    const updatedFolders = folders.map(folder => ({
      ...folder,
      chats: folder.chats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    }));
    setFolders(updatedFolders);
  };

  const handleRegenerate = async () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
      if (lastUserMessage) {
        setIsLoading(true);
        try {
          const relevantMessages = clearContextTimestamp
            ? messages.filter(msg => new Date(msg.timestamp) > new Date(clearContextTimestamp))
            : messages;

          const messagesWithSystemInstruction = initialSystemInstruction
            ? [{ role: 'system', content: initialSystemInstruction }, ...relevantMessages.slice(0, -1), lastUserMessage]
            : [...relevantMessages.slice(0, -1), lastUserMessage];

          const response = await createChatCompletion(messagesWithSystemInstruction, selectedApiKey, selectedModel, false, null, baseUrlKey);

          const outputTokens = estimateTokens(response.content);
          const outputCost = calculateTokenCost(outputTokens, modelConfig.outputCost);

          const regeneratedMessage = { 
            role: 'assistant', 
            content: response.content,
            timestamp: new Date().toISOString(),
            wordCount: countWords(response.content),
            tokenCount: outputTokens,
            cost: outputCost
          };

          setRegeneratedResponses(prev => ({
            ...prev,
            [messages.length - 1]: [...(prev[messages.length - 1] || []), regeneratedMessage]
          }));

          const updatedFolders = folders.map(folder => ({
            ...folder,
            chats: folder.chats.map(chat => 
              chat.id === currentChatId ? { 
                ...chat, 
                totalTokens: (chat.totalTokens || 0) + outputTokens,
                totalCost: (chat.totalCost || 0) + outputCost
              } : chat
            )
          }));
          setFolders(updatedFolders);

        } catch (error) {
          console.error('Error in handleRegenerate:', error);
          alert(`An error occurred while regenerating the message: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleClearContext = () => {
    const timestamp = new Date().toISOString();
    setClearContextTimestamp(timestamp);

    const updatedFolders = folders.map(folder => ({
      ...folder,
      chats: folder.chats.map(chat => 
        chat.id === currentChatId ? { ...chat, clearContextTimestamp: timestamp } : chat
      )
    }));
    setFolders(updatedFolders);
  };

  const handleCreateFolder = (folderName) => {
    const newFolder = { id: Date.now().toString(), name: folderName, chats: [] };
    setFolders([...folders, newFolder]);
  };

  const handleRenameFolder = (folderId, newName) => {
    const updatedFolders = folders.map(folder => 
      folder.id === folderId ? { ...folder, name: newName } : folder
    );
    setFolders(updatedFolders);
  };

  const handleDeleteFolder = (folderId) => {
    if (folderId === 'default') {
      alert('The default folder cannot be deleted.');
      return;
    }
    setFolders(folders.filter(folder => folder.id !== folderId));
  };

  const onMoveChatToFolder = (chatId, destinationFolderId) => {
    setFolders((prevFolders) => {
      let movedChat;
      const updatedFolders = prevFolders.map(folder => {
        const updatedChats = folder.chats.filter(chat => {
          if (chat.id === chatId) {
            movedChat = chat;
            return false;
          }
          return true;
        });
        return { ...folder, chats: updatedChats };
      });

      if (movedChat) {
        const destinationFolder = updatedFolders.find(folder => folder.id === destinationFolderId);
        if (destinationFolder) {
          destinationFolder.chats = [...destinationFolder.chats, movedChat];
        }
      }

      return updatedFolders;
    });
  };

  const exportData = () => {
    const data = { folders, apiKeys, initialSystemInstruction, savedPrompts, baseUrlKey };
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat_data.json';
    link.click();
  };

  const importData = (importedData) => {
    const { folders, apiKeys, initialSystemInstruction, savedPrompts, baseUrlKey } = importedData;
    setFolders(folders);
    setApiKeys(apiKeys);
    setInitialSystemInstruction(initialSystemInstruction);
    setSavedPrompts(savedPrompts);
    setBaseUrlKey(baseUrlKey);
  };

  const value = {
    folders,
    currentChatId,
    messages,
    apiKeys,
    selectedApiKey,
    isLoading,
    regeneratedResponses,
    clearContextTimestamp,
    selectedModel,
    previewMessage,
    models,
    initialSystemInstruction,
    baseUrlKey,
    setApiKeys,
    setSelectedApiKey,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleRenameChat,
    handleRegenerate,
    handleClearContext,
    changeSelectedModel,
    setPreviewMessage,
    setInitialSystemInstruction,
    savedPrompts,
    setSavedPrompts,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
    exportData,
    importData,
    onMoveChatToFolder,
    modelConfig,
    setBaseUrlKey,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
