import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Sender } from './types';
import { INITIAL_MESSAGES } from './constants';
import { generateCodexPrimeResponse, resetApiKeySelection } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import ApiKeySelector from './components/ApiKeySelector';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isSending, setIsSending] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const currentBotMessageId = useRef<string | null>(null);

  // Callback to update the streaming message
  const updateBotMessage = useCallback((chunk: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.sender === Sender.CodexPrime && lastMessage.isBotTyping) {
        // Append to the existing message if it's the current streaming message
        return prevMessages.map((msg) =>
          msg.id === lastMessage.id
            ? { ...msg, text: msg.text + chunk }
            : msg
        );
      } else {
        // Start a new message if it's the first chunk or previous message wasn't streaming
        currentBotMessageId.current = crypto.randomUUID();
        return [
          ...prevMessages,
          {
            id: currentBotMessageId.current,
            sender: Sender.CodexPrime,
            text: chunk,
            timestamp: new Date().toLocaleString(),
            isBotTyping: true, // Mark as currently streaming
          },
        ];
      }
    });
  }, []);

  // Callback to finalize the bot message after streaming ends
  const finalizeBotMessage = useCallback(() => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === currentBotMessageId.current
          ? { ...msg, isBotTyping: false }
          : msg
      )
    );
    currentBotMessageId.current = null;
    setIsSending(false);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: Sender.User,
      text: text,
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsSending(true);

    try {
      await generateCodexPrimeResponse(messages, text, updateBotMessage);
      finalizeBotMessage();
    } catch (error: any) {
      console.error('Failed to get response:', error);
      // Remove the partial bot message if an error occurred during streaming
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.sender === Sender.CodexPrime && lastMessage.isBotTyping) {
          return prevMessages.slice(0, prevMessages.length - 1);
        }
        return prevMessages;
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: crypto.randomUUID(),
          sender: Sender.CodexPrime,
          text: `Neural link disrupted: ${error.message}. Please try again. If persistent, re-establish neural connection.`,
          timestamp: new Date().toLocaleString(),
        },
      ]);
      setIsSending(false);
      currentBotMessageId.current = null;
      if (error.message && error.message.includes('API key error')) {
        setApiKeyReady(false); // Force re-selection
        resetApiKeySelection();
      }
    }
  }, [messages, updateBotMessage, finalizeBotMessage]);


  if (!apiKeyReady) {
    return <ApiKeySelector onApiKeyReady={() => setApiKeyReady(true)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100 font-['Space_Grotesk']">
      {/* The header is now integrated into ChatWindow.tsx */}
      <ChatWindow messages={messages} />
      <InputArea onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
};

export default App;