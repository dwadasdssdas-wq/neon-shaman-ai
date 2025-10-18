import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg glass-panel mb-3 animate-fade-in",
      isUser ? "ml-auto max-w-[80%]" : "mr-auto max-w-[85%]"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-accent/20" : "bg-primary/20"
      )}>
        {isUser ? (
          <User className="w-5 h-5 text-accent" />
        ) : (
          <Bot className="w-5 h-5 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium mb-1 text-foreground/90">
          {isUser ? 'Вы' : 'ShamanAI'}
        </div>
        <div className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
          {content}
        </div>
      </div>
    </div>
  );
};