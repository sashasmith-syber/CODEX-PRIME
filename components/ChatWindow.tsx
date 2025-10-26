import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage, Sender } from '../types'; // Import Sender enum
import MessageBubble from './MessageBubble';
import { MessageSquare, ArrowDown } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
}

const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div
      className="absolute rounded-full bg-[#39FF14]/20 blur-sm pointer-events-none"
      style={{
        width: Math.random() * 4 + 1 + 'px',
        height: Math.random() * 4 + 1 + 'px',
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    // Initial scroll on mount, not necessarily smooth if there are many initial messages
    if (messages.length > 0) {
      scrollToBottom(false);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll smoothly when messages change

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
    }
  };

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden flex flex-col font-['Space_Grotesk']">
      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.5} />
      ))}

      {/* Glow effect overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-[#39FF14]/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 border-b border-[#39FF14]/20 bg-black/40 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-center py-6 bg-gradient-to-r from-[#39FF14] via-[#00FF00] to-[#39FF14] bg-clip-text text-transparent transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(57,255,20,0.8)] cursor-default">
          CODEX PRIME NEURAL INTERFACE
        </h1>
      </div>

      {/* Messages container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 relative z-10"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#39FF14 transparent'
        }}
      >
        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            25% { transform: translate(10px, -20px) scale(1.2); opacity: 0.6; }
            50% { transform: translate(-15px, -40px) scale(0.8); opacity: 0.4; }
            75% { transform: translate(20px, -30px) scale(1.1); opacity: 0.5; }
          }
          
          @keyframes fade-in { /* Renamed to avoid clash with demo app's fadeSlideIn */
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(57, 255, 20, 0.3); }
            50% { box-shadow: 0 0 40px rgba(57, 255, 20, 0.6); }
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #39FF14;
            border-radius: 4px;
            opacity: 0.5;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #00FF00;
            box-shadow: 0 0 10px #39FF14;
          }
        `}</style>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <MessageSquare size={80} className="text-[#39FF14] mb-6 animate-pulse" />
            <p className="text-gray-400 text-xl font-light tracking-widest font-mono">
              AWAITING NEURAL INPUT...
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-8 right-8 z-20 bg-[#39FF14]/20 border border-[#39FF14] rounded-full p-3 transition-all duration-300 hover:bg-[#39FF14]/40 hover:scale-110 hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] backdrop-blur-xl"
          style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
        >
          <ArrowDown size={24} className="text-[#39FF14]" />
        </button>
      )}
    </div>
  );
};

export default ChatWindow;