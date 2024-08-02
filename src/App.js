import React from 'react';
import { ChatProvider } from './contexts/ChatContext';
import Home from './pages/Home';

function App() {
  return (
    <ChatProvider>
      <Home />
    </ChatProvider>
  );
}

export default App;