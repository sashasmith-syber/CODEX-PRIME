export enum Sender {
  User = 'user',
  CodexPrime = 'codexPrime',
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
  isBotTyping?: boolean;
}
