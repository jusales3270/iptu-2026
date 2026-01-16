import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';
import { User, Bot, FileIcon } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto w-full scroll-smooth">
      {/* Centered Column Container */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 min-h-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'
              }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === Role.USER
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 text-indigo-600'
                }`}
            >
              {msg.role === Role.USER ? (
                <User size={16} />
              ) : (
                <img
                  src="/avatar_btv.png"
                  alt="ChatBTV"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>

            {/* Message Content */}
            <div
              className={`flex flex-col max-w-[85%] sm:max-w-[75%] space-y-2 items-start ${msg.role === Role.USER ? 'items-end' : 'items-start'
                }`}
            >
              {/* Attachments */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 justify-end">
                  {msg.attachments.map((att, idx) => (
                    <div
                      key={`${msg.id}-att-${idx}`}
                      className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                    >
                      {att.contentType.startsWith('image/') ? (
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-32 h-32 object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-50 flex flex-col items-center justify-center p-2 text-center text-xs text-gray-600">
                          <FileIcon size={24} className="mb-2 opacity-50" />
                          <span className="truncate w-full">{att.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div
                className={`rounded-2xl px-5 py-3.5 text-sm sm:text-base leading-relaxed break-words ${msg.role === Role.USER
                    ? 'bg-gray-100 text-gray-900 rounded-tr-none'
                    : 'bg-transparent text-gray-800 px-0 py-0'
                  }`}
              >
                {msg.isThinking ? (
                  <div className="flex items-center gap-2 text-gray-400 py-2">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <div className="prose prose-sm prose-neutral max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} className="h-4" />
      </div>
    </div>
  );
};

export default MessageList;