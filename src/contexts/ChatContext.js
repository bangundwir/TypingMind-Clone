import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createChatCompletion } from '../services/api';
import { countWords, estimateTokens } from '../utils/textUtils';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useLocalStorage('chats', []);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useLocalStorage('apiKey', '');
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratedResponses, setRegeneratedResponses] = useState({});
  const [clearContextTimestamp, setClearContextTimestamp] = useState(null);
  const [selectedModel, setSelectedModel] = useLocalStorage('selectedModel', 'openai/gpt-4o-mini-2024-07-18');
  const [previewMessage, setPreviewMessage] = useState('');

  useEffect(() => {
    if (chats.length > 0 && !currentChatId) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  useEffect(() => {
    if (currentChatId) {
      const currentChat = chats.find(chat => chat.id === currentChatId);
      if (currentChat) {
        setMessages(currentChat.messages);
        setRegeneratedResponses({});
        setClearContextTimestamp(currentChat.clearContextTimestamp || null);
      }
    }
  }, [currentChatId, chats]);

  const handleSendMessage = async (message) => {
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }

    const newMessage = { 
      role: 'user', 
      content: message, 
      timestamp: new Date().toISOString(),
      wordCount: countWords(message),
      tokenCount: estimateTokens(message)
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const relevantMessages = clearContextTimestamp
        ? updatedMessages.filter(msg => new Date(msg.timestamp) > new Date(clearContextTimestamp))
        : updatedMessages;

      const response = await createChatCompletion(relevantMessages, apiKey, selectedModel);
      const assistantMessage = { 
        role: 'assistant', 
        content: response.content,
        timestamp: new Date().toISOString(),
        wordCount: countWords(response.content),
        tokenCount: estimateTokens(response.content)
      };
      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);

      const updatedChats = chats.map(chat => 
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat
      );

      if (updatedMessages.length === 1 && chats.find(chat => chat.id === currentChatId)?.title === 'New Chat') {
        const chatToUpdate = updatedChats.find(chat => chat.id === currentChatId);
        if (chatToUpdate) {
          chatToUpdate.title = response.content.split('\n')[0].slice(0, 30) + '...';
        }
      }

      setChats(updatedChats);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      alert(`An error occurred while sending the message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = { id: newChatId, title: 'New Chat', messages: [] };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setCurrentChatId(newChatId);
    setMessages([]);
    setRegeneratedResponses({});
    setClearContextTimestamp(null);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    if (chatId === currentChatId) {
      setCurrentChatId(updatedChats[0]?.id || null);
      setMessages(updatedChats[0]?.messages || []);
      setRegeneratedResponses({});
      setClearContextTimestamp(updatedChats[0]?.clearContextTimestamp || null);
    }
  };

  const handleRenameChat = (chatId, newTitle) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    );
    setChats(updatedChats);
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

          const response = await createChatCompletion([...relevantMessages.slice(0, -1), lastUserMessage], apiKey, selectedModel);
          const regeneratedMessage = { 
            role: 'assistant', 
            content: response.content,
            timestamp: new Date().toISOString(),
            wordCount: countWords(response.content),
            tokenCount: estimateTokens(response.content)
          };
          setRegeneratedResponses(prev => ({
            ...prev,
            [messages.length - 1]: [...(prev[messages.length - 1] || []), regeneratedMessage]
          }));
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
    
    const updatedChats = chats.map(chat => 
      chat.id === currentChatId ? { ...chat, clearContextTimestamp: timestamp } : chat
    );
    setChats(updatedChats);
  };

  const value = {
    chats,
    currentChatId,
    messages,
    apiKey,
    isLoading,
    regeneratedResponses,
    clearContextTimestamp,
    selectedModel,
    previewMessage,
    setApiKey,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleRenameChat,
    handleRegenerate,
    handleClearContext,
    setSelectedModel,
    setPreviewMessage
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};