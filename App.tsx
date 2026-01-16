import React, { useState, useCallback } from 'react';
import { PureMultimodalInput } from './components/MultimodalInput';
import MessageList from './components/MessageList';
import { streamOpenAIResponse } from './services/openaiService';
import { Message, Role, Attachment, UIMessage } from './types';

// Simple UUID generator fallback
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// Reliable PNG URL for the Coat of Arms
// Reliable PNG URL for the Coat of Arms
const BOITUVA_COAT_OF_ARMS_URL = "/brasao_btv.png";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  // attachments state is kept to satisfy signature but unused for now
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = useCallback(async (params: { input: string; attachments: Attachment[] }) => {
    const { input, attachments: newAttachments } = params;

    if (!input.trim() && newAttachments.length === 0) return;

    const userMessageId = generateId();
    const userMessage: Message = {
      id: userMessageId,
      role: Role.USER,
      content: input,
      attachments: newAttachments,
    };

    setMessages((prev) => [...prev, userMessage]);

    const botMessageId = generateId();
    const botMessagePlaceholder: Message = {
      id: botMessageId,
      role: Role.MODEL,
      content: '',
      isThinking: true,
    };

    setMessages((prev) => [...prev, botMessagePlaceholder]);
    setIsGenerating(true);

    try {
      const stream = streamOpenAIResponse(messages, input, newAttachments);

      let accumulatedText = '';

      for await (const textChunk of stream) {
        accumulatedText += textChunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: accumulatedText, isThinking: false }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, content: '**Erro:** Algo deu errado. Por favor, verifique sua chave de API ou tente novamente.', isThinking: false }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }, [messages]);

  const handleStopGenerating = useCallback(() => {
    setIsGenerating(false);
  }, []);

  const uiMessages: UIMessage[] = messages.map(m => ({
    id: m.id,
    content: m.content,
    role: m.role,
    attachments: m.attachments
  }));

  return (
    <div className="relative flex flex-col h-full w-full bg-white text-gray-900 font-sans overflow-hidden">

      {/* Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-center bg-no-repeat bg-[length:70%] md:bg-[length:25%] pointer-events-none opacity-[0.10] blur-[1.5px] grayscale transition-all duration-500"
        style={{
          backgroundImage: `url('${BOITUVA_COAT_OF_ARMS_URL}')`
        }}
      />

      {/* Header - Sticky & Full Width */}
      <header className="flex-none sticky top-0 z-30 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-center px-4 h-14 max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <img
              src={BOITUVA_COAT_OF_ARMS_URL}
              alt="Brasão de Boituva"
              className="h-8 w-auto"
            />
            <span className="text-gray-900 font-bold text-lg tracking-tight">ChatBTV - IPTU 2026</span>
          </div>
          {/* Future controls (Settings, History) can go here */}
        </div>
      </header>

      {/* Main Chat Area - Expands to fill space */}
      <div className="flex-1 relative z-10 flex flex-col min-h-0 overflow-hidden">
        <MessageList messages={messages} />
      </div>

      {/* Input Area - Fixed at bottom of the flow */}
      <div className="flex-none relative z-20 w-full bg-white/90 backdrop-blur-sm px-4 pb-4 sm:pb-6 pt-2 border-t border-gray-100/50">
        <div className="max-w-3xl mx-auto w-full">
          <PureMultimodalInput
            chatId="session-1"
            messages={uiMessages}
            onSendMessage={handleSendMessage}
            onStopGenerating={handleStopGenerating}
            isGenerating={isGenerating}
            canSend={!isGenerating}
            selectedVisibilityType="private"
            className="bg-gray-50/80 border-gray-200 focus-within:bg-white focus-within:shadow-md transition-all duration-200 ease-in-out rounded-2xl"
          />
          <div className="mt-3 flex items-center justify-center gap-2 opacity-70">
            <img
              src={BOITUVA_COAT_OF_ARMS_URL}
              alt="Brasão"
              className="h-3.5 w-auto grayscale opacity-80"
            />
            <p className="text-[11px] text-gray-400 font-medium">
              Construindo o progresso de mãos dadas com IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}