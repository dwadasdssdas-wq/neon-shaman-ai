// src/components/GraphVisualizer.tsx
import { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Zap } from 'lucide-react';

interface GraphVisualizerProps {
  expression: string;
}

export const GraphVisualizer = ({ expression }: GraphVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40;

    // Clear with gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
    gradient.addColorStop(1, 'rgba(88, 28, 135, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid with neon effect
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(width, centerY + i * scale);
      ctx.stroke();
    }

    // Draw axes with glow
    ctx.strokeStyle = '#00CED1';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00CED1';
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    ctx.shadowBlur = 0;

    // Draw function with neon trail
    try {
      ctx.strokeStyle = '#8A2BE2';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#8A2BE2';
      
      ctx.beginPath();
      let firstPoint = true;
      
      for (let px = 0; px < width; px += 0.5) {
        const x = (px - centerX) / scale;
        let y: number;
        
        // Enhanced function parser
        if (expression.includes('sin') && expression.includes('cos')) {
          y = Math.sin(x) * Math.cos(x);
        } else if (expression.includes('sin')) {
          y = Math.sin(x);
        } else if (expression.includes('cos')) {
          y = Math.cos(x);
        } else if (expression.includes('x^2')) {
          y = x * x;
        } else if (expression.includes('x^3')) {
          y = x * x * x;
        } else if (expression.includes('sqrt')) {
          y = Math.sqrt(Math.abs(x));
        } else if (expression.includes('log')) {
          y = Math.log(Math.abs(x) + 1);
        } else {
          y = Math.sin(x); // Default interesting function
        }
        
        const py = centerY - y * scale;
        
        if (firstPoint) {
          ctx.moveTo(px, py);
          firstPoint = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      
    } catch (error) {
      console.error('Error drawing graph:', error);
    }
  }, [expression]);

  return (
    <Card className="p-6 glass-panel border border-purple-500/30 neon-glow-purple">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-cyan-200">
          Визуализатор функций
        </h3>
      </div>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300} 
          className="w-full h-auto rounded-lg border border-cyan-500/20"
        />
        <div className="absolute bottom-2 right-2 text-xs text-cyan-300/60 bg-black/30 px-2 py-1 rounded">
          f(x) = {expression}
        </div>
      </div>
    </Card>
  );
};
