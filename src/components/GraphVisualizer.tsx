import { useEffect, useRef } from 'react';
import { Card } from './ui/card';

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
    const scale = 30;

    // Clear canvas
    ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#00CED1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 206, 209, 0.2)';
    ctx.lineWidth = 0.5;
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

    // Try to parse and draw the function
    try {
      const expr = expression.toLowerCase().replace(/\s/g, '');
      
      ctx.strokeStyle = '#8A2BE2';
      ctx.lineWidth = 2;
      ctx.beginPath();

      let firstPoint = true;
      for (let px = 0; px < width; px++) {
        const x = (px - centerX) / scale;
        let y: number;

        // Simple function parser
        if (expr.includes('sin')) {
          y = Math.sin(x);
        } else if (expr.includes('cos')) {
          y = Math.cos(x);
        } else if (expr.includes('x^2') || expr.includes('x²')) {
          y = x * x;
        } else if (expr.includes('x^3') || expr.includes('x³')) {
          y = x * x * x;
        } else if (expr.includes('sqrt')) {
          y = Math.sqrt(Math.abs(x));
        } else {
          y = x; // linear by default
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
    } catch (error) {
      console.error('Error drawing graph:', error);
    }
  }, [expression]);

  return (
    <Card className="p-4 glass-panel">
      <h3 className="text-lg font-semibold mb-2 text-primary">График функции</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-auto rounded-md border border-border"
      />
    </Card>
  );
};