// src/components/ChatMessage.tsx
import { Bot, User, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div className={cn(
      "flex gap-4 p-6 rounded-2xl mb-4 animate-fade-in border-2 backdrop-blur-sm",
      isUser 
        ? "ml-auto max-w-[80%] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/30" 
        : "mr-auto max-w-[85%] bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30"
    )}>
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2",
        isUser 
          ? "bg-cyan-500/20 border-cyan-400" 
          : "bg-purple-500/20 border-purple-400 relative"
      )}>
        {isUser ? (
          <User className="w-5 h-5 text-cyan-400" />
        ) : (
          <>
            <Bot className="w-5 h-5 text-purple-400" />
            <Sparkles className="w-3 h-3 text-pink-400 absolute -top-1 -right-1" />
          </>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn(
            "text-sm font-semibold",
            isUser ? "text-cyan-400" : "text-purple-400"
          )}>
            {isUser ? 'Вы' : 'ShamanAI'}
          </span>
          <span className="text-xs text-gray-400">
            {timestamp.toLocaleTimeString()}
          </span>
          {!isUser && (
            <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
          )}
        </div>
        
        <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
          {content.split('\n').map((line, index) => (
            <p key={index} className="mb-2 last:mb-0">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
