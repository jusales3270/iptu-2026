export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Attachment {
  url: string;
  name: string;
  contentType: string;
  size: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  attachments?: Attachment[];
  isThinking?: boolean;
}

export interface UIMessage {
  id: string;
  content: string;
  role: string;
  attachments?: Attachment[];
}