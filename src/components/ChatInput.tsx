// src/components/ChatInput.tsx
import { useState } from 'react';
import { Send, Image, Calculator, Atom, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string, type?: string) => void;
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, onImageUpload, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chat' | 'math' | 'physics'>('chat');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input, mode);
    setInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={mode === 'chat' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('chat')}
          className={cn(
            "flex-1 transition-all duration-300 border-2",
            mode === 'chat' 
              ? "bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/25" 
              : "bg-transparent border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400"
          )}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Диалог
        </Button>
        <Button>
  <MessageCircle className="w-4 h-4 mr-2" />
  Диалог
</Button>
        <Button
          type="button"
          variant={mode === 'math' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('math')}
          className={cn(
            "flex-1 transition-all duration-300 border-2",
            mode === 'math' 
              ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/25" 
              : "bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
          )}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Математика
        </Button>
        <Button
          type="button"
          variant={mode === 'physics' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('physics')}
          className={cn(
            "flex-1 transition-all duration-300 border-2",
            mode === 'physics' 
              ? "bg-pink-600 border-pink-400 text-white shadow-lg shadow-pink-500/25" 
              : "bg-transparent border-pink-500/30 text-pink-300 hover:bg-pink-500/10 hover:border-pink-400"
          )}
        >
          <Atom className="w-4 h-4 mr-2" />
          Физика
        </Button>
      </div>
      
      <div className="flex gap-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'math' ? '🔢 Введите математический запрос для глубинного анализа...' :
            mode === 'physics' ? '⚛️ Опишите физическое явление для квантового исследования...' :
            '💬 Задайте любой вопрос для уникального анализа...'
          }
          className="flex-1 resize-none min-h-[80px] bg-gray-800/50 border-2 border-cyan-500/30 focus:border-cyan-400 text-cyan-100 placeholder-cyan-200/40 rounded-xl transition-all duration-300"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <div className="flex flex-col gap-3">
          <label className={cn(
            "cursor-pointer p-3 rounded-lg border-2 border-purple-500/30 transition-all duration-300 flex items-center justify-center",
            "hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/25",
            isLoading && "opacity-50 cursor-not-allowed"
          )}>
            <Image className="w-5 h-5 text-purple-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
          </label>
          
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className={cn(
              "w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 border-2 border-cyan-400/50",
              "hover:from-cyan-600 hover:to-purple-700 hover:shadow-lg hover:shadow-cyan-500/25",
              "transition-all duration-300 transform hover:scale-105",
              (!input.trim() || isLoading) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};
