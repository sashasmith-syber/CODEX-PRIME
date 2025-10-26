
import React from 'react';
import { ChatMessage, Sender } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  index: number; // Added for staggered animation
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index }) => {
  const isUser = message.sender === Sender.User;
  const isCodexPrimeTyping = message.sender === Sender.CodexPrime && message.isBotTyping;

  const bubbleClasses = isUser
    ? 'bg-gradient-to-br from-[#39FF14]/20 to-[#39FF14]/5 border border-[#39FF14]/30' // Acid green for user
    : 'bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50'; // Darker for Codex Prime

  const textClasses = isUser
    ? 'text-gray-100 font-light tracking-wide leading-relaxed'
    : 'text-gray-100 font-light tracking-wide leading-relaxed'; // Consistent text style

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div
        className={`max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-6 py-4 rounded-2xl relative group transition-all duration-300 ${bubbleClasses} hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] backdrop-blur-xl`}
      >
        <p className={textClasses}>{message.text}</p>
        {isCodexPrimeTyping && (
          <div className="flex items-center space-x-1 mt-2 mb-1">
            <span className="h-2 w-2 bg-[#39FF14] rounded-full animate-pulse-dot" style={{ animationDelay: '0s' }}></span>
            <span className="h-2 w-2 bg-[#39FF14] rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-2 w-2 bg-[#39FF14] rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }}></span>
          </div>
        )}
        <span className="text-[10px] text-gray-500 mt-2 block font-mono">
          {message.timestamp.split(', ')[1]} {/* Display only time for brevity */}
        </span>

        {/* Typing indicator keyframes */}
        <style>{`
          @keyframes pulse-dot {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MessageBubble;