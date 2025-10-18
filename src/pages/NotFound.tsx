// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <Card className="glass-panel p-8 max-w-md w-full text-center border border-cyan-500/30 neon-glow">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-cyan-400/30">
          <div className="text-2xl">404</div>
        </div>
        
        <h1 className="text-2xl font-bold text-cyan-200 mb-3">
          Квантовая аномалия
        </h1>
        
        <p className="text-cyan-200/70 mb-6 leading-relaxed">
          Запрошенный вами путь находится за пределами нашей матрицы. 
          Возможно, он переместился в параллельную вселенную или был поглощен сингулярностью.
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button asChild className="bg-cyan-600 hover:bg-cyan-700 border-2 border-cyan-400/50">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              В матрицу
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
            <button onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
