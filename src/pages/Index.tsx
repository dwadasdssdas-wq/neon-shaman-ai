import { useState, useRef, useEffect } from 'react';
import { MatrixBackground } from '@/components/MatrixBackground';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { GraphVisualizer } from '@/components/GraphVisualizer';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Tesseract from 'tesseract.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Привет! Я ShamanAI - продвинутый ИИ-ассистент. Могу помочь с:\n\n🔮 Интеллектуальными беседами\n🖼️ Анализом изображений и текста\n🔢 Решением математических задач\n⚛️ Физическими расчетами\n📊 Построением графиков\n\nЧто вас интересует?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphExpression, setGraphExpression] = useState('sin(x)');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessage: Message, type: string = 'chat') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shaman-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg?.role === 'assistant') {
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: assistantMessage
                  };
                } else {
                  newMessages.push({
                    role: 'assistant',
                    content: assistantMessage
                  });
                }
                return newMessages;
              });
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }

      // Check if we should show a graph
      const lowerContent = assistantMessage.toLowerCase();
      if (lowerContent.includes('график') || lowerContent.includes('функци')) {
        const mathFunctions = ['sin', 'cos', 'x^2', 'x²', 'x^3', 'sqrt'];
        for (const func of mathFunctions) {
          if (lowerContent.includes(func)) {
            setGraphExpression(func);
            setShowGraph(true);
            break;
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка при отправке сообщения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (content: string, type?: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    streamChat(userMessage, type);
  };

  const handleImageUpload = async (file: File) => {
    toast.info('Анализирую изображение...');
    setIsLoading(true);

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'rus+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            toast.info(`Распознавание: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      if (text.trim()) {
        const userMessage: Message = {
          role: 'user',
          content: `Я загрузил изображение с текстом:\n\n${text}\n\nПожалуйста, помоги разобраться с этим содержимым.`
        };
        setMessages(prev => [...prev, userMessage]);
        await streamChat(userMessage, 'image');
        toast.success('Изображение проанализировано!');
      } else {
        toast.error('Не удалось распознать текст на изображении');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('OCR error:', error);
      toast.error('Ошибка при анализе изображения');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MatrixBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Header */}
        <header className="glass-panel rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold neon-text">ShamanAI</h1>
              <p className="text-sm text-muted-foreground">Продвинутый ИИ-ассистент</p>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} role={msg.role} content={msg.content} />
          ))}
          {isLoading && (
            <div className="flex gap-2 items-center glass-panel p-4 rounded-lg animate-pulse">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary animate-spin" />
              </div>
              <span className="text-sm text-muted-foreground">ShamanAI думает...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Graph Visualizer */}
        {showGraph && (
          <div className="mb-4">
            <GraphVisualizer expression={graphExpression} />
          </div>
        )}

        {/* Chat Input */}
        <ChatInput
          onSend={handleSend}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;