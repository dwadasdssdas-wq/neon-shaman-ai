import { useState } from 'react';
import { Send, Image, Calculator, Atom } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="glass-panel p-4 rounded-lg">
      <div className="flex gap-2 mb-3">
        <Button
          type="button"
          variant={mode === 'chat' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('chat')}
          className="flex-1"
        >
          💬 Чат
        </Button>
        <Button
          type="button"
          variant={mode === 'math' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('math')}
          className="flex-1"
        >
          <Calculator className="w-4 h-4 mr-1" />
          Математика
        </Button>
        <Button
          type="button"
          variant={mode === 'physics' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('physics')}
          className="flex-1"
        >
          <Atom className="w-4 h-4 mr-1" />
          Физика
        </Button>
      </div>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'math' ? 'Задайте математический вопрос...' :
            mode === 'physics' ? 'Задайте вопрос по физике...' :
            'Введите сообщение...'
          }
          className="resize-none min-h-[60px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex flex-col gap-2">
          <label className={cn(
            "cursor-pointer p-2 rounded-md transition-colors",
            "hover:bg-secondary/20 border border-border"
          )}>
            <Image className="w-5 h-5 text-secondary" />
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
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};