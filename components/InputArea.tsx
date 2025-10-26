import React, { useState } from 'react';
import { Send } from 'lucide-react'; // Import Lucide icon for send button

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isSending }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSending) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 bg-black/40 p-4 md:p-6 border-t border-[#39FF14]/20 shadow-lg flex items-center gap-4 z-10 backdrop-blur-xl font-['Space_Grotesk']"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isSending ? 'Codex Prime is processing...' : 'Enter neural directive, Operator...'}
        className="flex-1 p-3 rounded-lg bg-gray-900/60 text-gray-50 border border-[#39FF14]/30 focus:outline-none focus:ring-2 focus:ring-[#39FF14] placeholder-[#39FF14]/50 disabled:opacity-75 disabled:cursor-not-allowed transition-colors duration-200"
        disabled={isSending}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#39FF14]/30 border border-[#39FF14] text-[#39FF14] font-semibold rounded-lg shadow-md transition-all duration-200 disabled:bg-gray-600/50 disabled:border-gray-700 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:ring-offset-2 focus:ring-offset-black flex items-center justify-center gap-2 hover:bg-[#39FF14]/50"
        disabled={isSending || !input.trim()}
      >
        {isSending ? (
          <svg className="animate-spin h-5 w-5 text-[#39FF14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <Send size={20} />
            <span>Send</span>
          </>
        )}
      </button>
    </form>
  );
};

export default InputArea;