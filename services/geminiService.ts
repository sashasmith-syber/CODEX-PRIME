import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage, Sender } from '../types';
import { FULL_SYSTEM_INSTRUCTION, GEMINI_MODEL_NAME, OPERATOR_NAME } from '../constants';

// The `window.aistudio` object is assumed to be globally available and correctly typed
// by the environment or other declaration files, as per the coding guidelines.
// Removing this explicit `declare global` block resolves "subsequent property declarations" errors.

let chatSession: Chat | null = null;

// Helper to create a new GoogleGenAI instance.
// IMPORTANT: Create this right before making an API call to ensure it uses the most up-to-date API key.
const createGoogleGenAI = () => {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable is not set.');
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getOrCreateChatSession = (): Promise<Chat> => {
  if (chatSession) {
    return Promise.resolve(chatSession);
  }

  const ai = createGoogleGenAI();
  chatSession = ai.chats.create({
    model: GEMINI_MODEL_NAME,
    config: {
      systemInstruction: FULL_SYSTEM_INSTRUCTION,
      temperature: 0.8, // Adjust creativity while maintaining professionalism
      topK: 64,
      topP: 0.95,
    },
  });
  return Promise.resolve(chatSession);
};

export const generateCodexPrimeResponse = async (
  messages: ChatMessage[],
  currentPrompt: string,
  onNewChunk: (chunk: string) => void,
): Promise<void> => {
  let ai: GoogleGenAI;
  try {
    ai = createGoogleGenAI();
  } catch (error) {
    console.error('Failed to initialize GoogleGenAI:', error);
    throw new Error('API Key is not configured. Please select your API key.');
  }

  try {
    const chat = await getOrCreateChatSession();

    const responseStream = await chat.sendMessageStream({ message: currentPrompt });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        onNewChunk(chunk.text);
      }
    }
  } catch (error: any) {
    console.error('Error generating content:', error);
    if (error.message && error.message.includes('Requested entity was not found.')) {
      // API key might be invalid or needs re-selection
      resetApiKeySelection();
      throw new Error('API key error: Requested entity was not found. Please re-select your API key.');
    }
    throw new Error(`Failed to get response from Codex Prime: ${error.message || 'Unknown error'}`);
  }
};

export const checkApiKeySelected = async (): Promise<boolean> => {
  if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
    return await window.aistudio.hasSelectedApiKey();
  }
  // Fallback for environments where window.aistudio is not available
  // Assume API_KEY is set via environment variable for local development
  return !!process.env.API_KEY;
};

export const promptForApiKey = async (): Promise<void> => {
  if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
    await window.aistudio.openSelectKey();
    // Assuming selection was successful for race condition mitigation
    // In a real app, you might re-check after a short delay or rely on a state update.
  } else {
    alert('Please ensure your API_KEY is set in the environment variables.');
  }
};

export const resetApiKeySelection = (): void => {
  // Logic to clear any cached API key state if necessary, and prompt user again.
  // For this context, simply nullifying the chat session might be enough to force re-creation.
  chatSession = null;
  console.log('API Key selection reset. User will be prompted again.');
};