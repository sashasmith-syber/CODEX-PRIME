import React, { useEffect, useState, useCallback } from 'react';
import { checkApiKeySelected, promptForApiKey } from '../services/geminiService';
import { TriangleAlert } from 'lucide-react';

interface ApiKeySelectorProps {
  onApiKeyReady: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onApiKeyReady }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyApiKey = useCallback(async () => {
    setLoading(true);
    const selected = await checkApiKeySelected();
    setHasKey(selected);
    setLoading(false);
    if (selected) {
      onApiKeyReady();
    }
  }, [onApiKeyReady]);

  useEffect(() => {
    verifyApiKey();
  }, [verifyApiKey]);

  const handleSelectKey = async () => {
    setLoading(true);
    try {
      await promptForApiKey();
      // Assume selection was successful to mitigate race conditions
      setHasKey(true);
      onApiKeyReady();
    } catch (error) {
      console.error('Error selecting API key:', error);
      setHasKey(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[#39FF14] p-4 font-['Space_Grotesk']">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#39FF14]"></div>
        <p className="mt-4 text-lg">Verifying neural authentication...</p>
      </div>
    );
  }

  if (hasKey) {
    return null; // Key is ready, component renders nothing
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-100 p-4 text-center font-['Space_Grotesk']">
      <TriangleAlert size={60} className="text-red-500 mb-6 animate-pulse" />
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#39FF14] animate-fade-in">Codex Prime Interface</h1>
      <p className="text-lg mb-8 max-w-xl text-gray-300 animate-fade-in delay-100">
        To initiate communication with Codex Prime, an advanced AI entity, please select your Gemini API key.
        This provides the necessary neural pathways for optimal interaction.
      </p>
      <button
        onClick={handleSelectKey}
        className="px-8 py-3 bg-[#39FF14]/30 border border-[#39FF14] text-[#39FF14] font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-[#39FF14]/50 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:ring-offset-2 focus:ring-offset-black animate-pulse-glow-alt"
      >
        Establish Neural Link
      </button>
      <p className="mt-8 text-sm text-gray-500 max-w-xl animate-fade-in delay-200">
        A valid Gemini API key is crucial for accessing Codex Prime's advanced capabilities.
        Ensure billing is activated for your Google Cloud project.
        For detailed protocol information: <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ai.google.dev/gemini-api/docs/billing</a>
      </p>
      {/* Global styles for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }

        @keyframes pulse-glow-alt {
            0%, 100% { box-shadow: 0 0 15px rgba(57, 255, 20, 0.4); border-color: rgba(57, 255, 20, 0.6); }
            50% { box-shadow: 0 0 25px rgba(57, 255, 20, 0.8); border-color: rgba(57, 255, 20, 1); }
        }
      `}</style>
    </div>
  );
};

export default ApiKeySelector;