import { useState, useRef, useEffect } from 'react';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { GraphVisualizer } from '@/components/GraphVisualizer';
import { MatrixBackground } from '@/components/MatrixBackground';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';
import { Brain, Zap, Cpu, Sparkles } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string, type?: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const context = messages.slice(-3).map(m => m.content).join(' ');
    const userIntent = userMessage.toLowerCase();

    if (type === 'math') {
      return `🧮 *Математический анализ*\n\nВаш запрос "${userMessage}" требует глубокого математического подхода...`;
    }

    if (type === 'physics') {
      return `⚛️ *Физический анализ*\n\nИсследую физические аспекты вашего вопроса "${userMessage}"...`;
    }

    return `🧠 *Глубокий анализ*\n\nИсследую ваш запрос "${userMessage}" с междисциплинарной точки зрения...`;
  };

  const handleSend = async (message: string, type?: string) => {
    if (!message.trim()) return;

    const userMessage: Message = { 
      role: 'user', 
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateAIResponse(message, type);
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Попробуйте еще раз.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const analysis = `🖼️ *Анализ изображения*\n\nПровел анализ загруженного изображения...`;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: analysis,
        timestamp: new Date()
      }]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обработать изображение.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      <MatrixBackground />
      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-12 h-12 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              ShamanAI
            </h1>
            <Cpu className="w-12 h-12 text-purple-400 animate-pulse" />
          </div>
          <p className="text-xl text-cyan-200/80 mb-2">
            Квантовый интеллект следующего поколения
          </p>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 glass-panel border border-cyan-500/30">
            <ScrollArea className="h-[500px] p-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-cyan-200 mb-2">
                    Активация нейросети
                  </h3>
                  <p className="text-cyan-200/60">
                    Задайте любой вопрос для анализа...
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                ))
              )}
              {isLoading && (
                <div className="flex items-center gap-3 p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-cyan-300/70 text-sm">Анализ...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </Card>

          <div className="space-y-6">
            <GraphVisualizer expression="sin(x)*cos(x)" />
          </div>
        </div>

        <div className="glass-panel border border-cyan-500/20 rounded-xl">
          <ChatInput
            onSend={handleSend}
            onImageUpload={handleImageUpload}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
