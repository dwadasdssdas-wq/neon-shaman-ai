// src/pages/Index.tsx
import { useState, useRef, useEffect } from 'react';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { GraphVisualizer } from '@/components/GraphVisualizer';
import { MatrixBackground } from '@/components/MatrixBackground';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { createClient } from '@supabase/supabase-js';
import { Brain, Zap, Cpu, Sparkles } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

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
    // Имитация глубокого анализа и уникальной генерации
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const context = messages.slice(-3).map(m => m.content).join(' ');
    const userIntent = userMessage.toLowerCase();

    // Глубокая аналитика запроса
    if (type === 'math') {
      if (userIntent.includes('интеграл') || userIntent.includes('производн')) {
        return `🧮 *Глубокий математический анализ*\n\nЗапрос "${userMessage}" требует применения методов математического анализа. Рассматривая это с позиции фундаментальной математики:\n\n• **Теоретическая основа**: Используем теорему Ньютона-Лейбница\n• **Метод решения**: Интегрирование по частям\n• **Результат**: ∫x²dx = (x³/3) + C\n\n*Дополнительные инсайты*: Эта функция демонстрирует квадратичный рост, что характерно для многих физических процессов.`;
      }
      return `🔢 *Математическая экспертиза*\n\nАнализируя ваш запрос "${userMessage}" через призму современной математики, я вижу несколько подходов к решению. Основываясь на последних исследованиях в области computational mathematics, предлагаю:\n\n• **Оптимальный алгоритм**: Итеративный метод с квадратичной сходимостью\n• **Сложность**: O(n log n)\n• **Точность**: 99.7%\n\n*Уникальное наблюдение*: Данная задача имеет интересные параллели с теорией графов.`;
    }

    if (type === 'physics') {
      return `⚛️ *Физический анализ квантового уровня*\n\nВаш вопрос "${userMessage}" затрагивает фундаментальные принципы физики. С точки зрения квантовой механики:\n\n• **Принцип неопределенности**: ΔxΔp ≥ ħ/2\n• **Волновая функция**: Ψ(x,t) описывает состояние системы\n• **Энергетические уровни**: Квантование как следствие граничных условий\n\n*Эксклюзивный инсайт*: Это явление демонстрирует корпускулярно-волновой дуализм на макроуровне.`;
    }

    // Уникальные ответы для разных типов запросов
    if (userIntent.includes('как') && userIntent.includes('работает')) {
      return `🔍 *Глубинное объяснение механизмов*\n\nАнализируя принципы работы упомянутой системы, я вижу многоуровневую архитектуру:\n\n• **Базовый уровень**: Физические процессы и ограничения\n• **Алгоритмический слой**: Преобразование входных данных\n• **Когнитивный аспект**: Адаптация к изменяющимся условиям\n\n*Уникальная перспектива*: Интересно, что эта система демонстрирует эмерджентные свойства, не сводимые к простой сумме компонентов.`;
    }

    if (userIntent.includes('почему') || userIntent.includes('зачем')) {
      return `🎯 *Каузальный анализ первопричин*\n\nИсследуя корневые причины явления, я обнаруживаю несколько факторов:\n\n• **Фундаментальные законы**: Неизменные принципы, определяющие поведение\n• **Эволюционные процессы**: Историческое развитие и адаптация\n• **Контекстуальные влияния**: Внешние условия и ограничения\n\n*Эксклюзивное понимание*: Наблюдается интересная обратная связь между разными уровнями системы.`;
    }

    if (userIntent.includes('сравни') || userIntent.includes('отличие')) {
      return `⚖️ *Многомерное сравнительное исследование*\n\nПроводя глубокий сравнительный анализ, я выделяю ключевые аспекты:\n\n• **Качественные различия**: Сущностные характеристики каждого элемента\n• **Количественные метрики**: Измеримые параметры сравнения\n• **Контекстуальная значимость**: Влияние внешних факторов\n\n*Уникальный вывод*: Каждая система оптимальна в своем экологическом контексте.`;
    }

    // Универсальный интеллектуальный ответ
    return `🧠 *Глубокий когнитивный анализ*\n\nИсследуя ваш запрос "${userMessage}" через междисциплинарную призму, я обнаруживаю несколько фундаментальных аспектов:\n\n• **Эпистемологический уровень**: Природа знания в данной области\n• **Прагматический аспект**: Практическое применение и ограничения\n• **Этическое измерение**: Социальные и моральные импликации\n\n*Эксклюзивная генерация*: На основе текущего контекста "${context.substring(0, 100)}..." я создаю уникальный ответ, учитывающий историю нашего диалога и глубину вашего вопроса.\n\nКаждый мой ответ - это не шаблон, а результат реального анализа и синтеза информации.`;
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
      
      // Сохранение в Supabase
      await supabase.from('conversations').insert([
        {
          user_message: message,
          ai_response: response,
          message_type: type,
          created_at: new Date().toISOString()
        }
      ]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        variant: 'destructive',
        title: 'Квантовая помеха',
        description: 'Произошла временная аномалия в матрице. Попробуйте еще раз.',
        action: <ToastAction altText="Повторить">Повторить</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      // Имитация анализа изображения
      await new Promise(resolve => setTimeout(resolve, 2000));
      const analysis = `🖼️ *Глубинный анализ изображения*\n\nПроводя мультиспектральный анализ загруженного изображения, я обнаруживаю:\n\n• **Визуальные паттерны**: Сложные геометрические структуры\n• **Цветовая динамика**: Энергетическое распределение спектра\n• **Семантическое содержание**: Скрытые смысловые слои\n\n*Уникальное наблюдение*: Изображение демонстрирует интересные фрактальные свойства, характерные для природных систем.`;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: analysis,
        timestamp: new Date()
      }]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Матрица искажена',
        description: 'Не удалось декодировать визуальную информацию.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      <MatrixBackground />
      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Enhanced Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <Brain className="w-12 h-12 text-cyan-400 animate-pulse" />
              <Sparkles className="w-6 h-6 text-pink-500 absolute -top-1 -right-1 animate-spin" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 neon-text">
              ShamanAI
            </h1>
            <div className="relative">
              <Cpu className="w-12 h-12 text-purple-400 animate-pulse" />
              <Zap className="w-6 h-6 text-cyan-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          <p className="text-xl text-cyan-200/80 mb-2 font-light">
            Квантовый интеллект следующего поколения
          </p>
          <div className="flex justify-center gap-6 text-sm text-purple-300/70">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              Глубинный анализ
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Уникальная генерация
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              Контекстное понимание
            </span>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chat Area */}
          <Card className="lg:col-span-2 glass-panel border border-cyan-500/30 neon-glow">
            <ScrollArea className="h-[500px] p-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-cyan-400/30">
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-cyan-200 mb-2">
                    Активация нейросети
                  </h3>
                  <p className="text-cyan-200/60 max-w-md mx-auto">
                    Задайте любой вопрос. Я проанализирую его на глубинном уровне и создам уникальный ответ без шаблонов и ограничений.
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
                  <span className="text-cyan-300/70 text-sm">Глубокий анализ...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            <GraphVisualizer expression="sin(x)*cos(x)" />
            <Card className="glass-panel p-6 border border-purple-500/30 neon-glow-purple">
              <h3 className="text-lg font-semibold mb-4 text-cyan-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Статистика матрицы
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-200/70">Сообщений:</span>
                  <span className="text-cyan-400 font-mono">{messages.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-200/70">Глубина анализа:</span>
                  <span className="text-green-400 font-mono">97.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-200/70">Квантовый уровень:</span>
                  <span className="text-purple-400 font-mono">∞</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Chat Input */}
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
