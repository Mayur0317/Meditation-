import React, { useRef, useEffect, useState } from 'react';
import { Shovel, RotateCcw, Mountain, Droplet, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundSynthesis';

interface Stone {
  x: number;
  y: number;
  radius: number;
  color: string;
  hasMoss: boolean;
}

export const ZenSandGarden: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTool, setActiveTool] = useState<'rake' | 'stone' | 'ripple'>('rake');
  const [stones, setStones] = useState<Stone[]>([
    { x: 120, y: 90, radius: 24, color: '#3d3a37', hasMoss: true },
    { x: 145, y: 110, radius: 16, color: '#2b2927', hasMoss: false },
    { x: 320, y: 150, radius: 30, color: '#4a4642', hasMoss: true }
  ]);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize and redraw the sand canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      renderBaseSand(ctx, rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const renderBaseSand = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Fill subtle quartz mineral sand background
    const sandGrad = ctx.createLinearGradient(0, 0, width, height);
    sandGrad.addColorStop(0, '#dfd6c5');
    sandGrad.addColorStop(0.5, '#d4c8b3');
    sandGrad.addColorStop(1, '#c8bba3');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, 0, width, height);

    // Initial traditional meditative raked concentric ripples around stones
    drawInitialRipples(ctx, width, height);
    drawStones(ctx);
  };

  const drawInitialRipples = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Parallel wave grooves across the whole sandbed
    ctx.strokeStyle = 'rgba(120, 105, 85, 0.28)';
    ctx.lineWidth = 2.5;

    for (let y = 15; y < height; y += 14) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      for (let x = 10; x < width - 10; x += 10) {
        const offset = Math.sin((x + y * 2) * 0.03) * 3.5;
        ctx.lineTo(x, y + offset);
      }
      ctx.stroke();
    }

    // Concentric rippling rings around each stone
    stones.forEach(st => {
      for (let r = st.radius + 8; r <= st.radius + 36; r += 7) {
        ctx.beginPath();
        ctx.arc(st.x, st.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(100, 85, 68, 0.35)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  const drawStones = (ctx: CanvasRenderingContext2D) => {
    stones.forEach(st => {
      // Deep stone cast shadow
      ctx.fillStyle = 'rgba(60, 50, 40, 0.45)';
      ctx.beginPath();
      ctx.ellipse(st.x + 4, st.y + 6, st.radius + 2, st.radius * 0.7, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Stone body gradient
      const stoneGrad = ctx.createRadialGradient(st.x - st.radius * 0.3, st.y - st.radius * 0.3, 2, st.x, st.y, st.radius);
      stoneGrad.addColorStop(0, '#78716c');
      stoneGrad.addColorStop(0.5, st.color);
      stoneGrad.addColorStop(1, '#1c1917');

      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
      ctx.fill();

      // Organic stone highlight rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Ancient green velvet moss on stone
      if (st.hasMoss) {
        ctx.fillStyle = '#4d7c0f';
        ctx.beginPath();
        ctx.arc(st.x - st.radius * 0.3, st.y - st.radius * 0.2, st.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#65a30d';
        ctx.beginPath();
        ctx.arc(st.x - st.radius * 0.4, st.y - st.radius * 0.3, st.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    isDrawingRef.current = true;
    lastPosRef.current = coords;

    if (activeTool === 'stone') {
      const newStone: Stone = {
        x: coords.x,
        y: coords.y,
        radius: 14 + Math.floor(Math.random() * 16),
        color: ['#3d3a37', '#292524', '#44403c', '#57534e'][Math.floor(Math.random() * 4)],
        hasMoss: Math.random() > 0.4
      };
      setStones(prev => [...prev.slice(-6), newStone]);
      soundEngine.playWaterDrop();
    } else if (activeTool === 'ripple') {
      drawWaterRipple(coords.x, coords.y);
      soundEngine.playWaterDrop();
    }
  };

  const drawWaterRipple = (cx: number, cy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let r = 8; r <= 48; r += 8) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(90, 75, 60, 0.35)';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activeTool !== 'rake') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    if (!lastPosRef.current) {
      lastPosRef.current = coords;
      return;
    }

    // Wooden rake 5-prong groove lines
    const dx = coords.x - lastPosRef.current.x;
    const dy = coords.y - lastPosRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 2) return;

    // Normal vector perpendicular to rake stroke
    const nx = -dy / dist;
    const ny = dx / dist;
    const prongs = [-12, -6, 0, 6, 12];

    prongs.forEach(offset => {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current!.x + nx * offset, lastPosRef.current!.y + ny * offset);
      ctx.lineTo(coords.x + nx * offset, coords.y + ny * offset);
      
      // Shadow groove
      ctx.strokeStyle = 'rgba(95, 78, 60, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Ridge highlight
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current!.x + nx * offset + 1, lastPosRef.current!.y + ny * offset + 1);
      ctx.lineTo(coords.x + nx * offset + 1, coords.y + ny * offset + 1);
      ctx.strokeStyle = 'rgba(255, 250, 240, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    lastPosRef.current = coords;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const smoothGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    soundEngine.playWaterDrop();
    const rect = canvas.getBoundingClientRect();
    renderBaseSand(ctx, rect.width, rect.height);
  };

  return (
    <div id="zen-garden-card" className="relative flex flex-col items-center bg-[#18130e]/80 border border-[#443322]/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 mb-2 border-b border-[#3d2b1b]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Mountain className="w-4 h-4 text-amber-400" />
          <h3 className="font-['Marcellus',serif] text-base sm:text-lg text-[#f3e8d2] tracking-wider uppercase">
            Karesansui Sand Garden
          </h3>
        </div>
        <button
          id="smooth-sand-btn"
          onClick={smoothGarden}
          className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-[#2a1d13] border border-[#553b26] text-[#e0cfbb] hover:bg-[#3d2a1b] hover:text-amber-300 transition-colors"
          title="Smooth the sand ripples with clean bamboo rake"
        >
          <RotateCcw className="w-3 h-3 text-amber-400" />
          <span>Smooth Sand</span>
        </button>
      </div>

      {/* Interactive Sand Bed Frame (Cedar Wood Tatami border) */}
      <div className="relative w-full h-64 sm:h-72 p-2.5 rounded-xl bg-gradient-to-br from-[#4a3525] via-[#2f1f14] to-[#1a120b] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_8px_20px_rgba(0,0,0,0.6)] border border-[#5c4028]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full rounded-lg cursor-crosshair block touch-none"
        />

        {/* Ambient watermark label in corner */}
        <div className="absolute bottom-4 right-4 pointer-events-none text-[10px] font-['Space_Mono'] text-[#4a3525] tracking-widest uppercase">
          枯山水 • Kyoto Zen
        </div>
      </div>

      {/* Tool Selector Bar */}
      <div className="w-full mt-3 pt-3 border-t border-[#3d2b1b]/60 flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5">
          <button
            id="tool-rake"
            onClick={() => setActiveTool('rake')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs transition-all ${
              activeTool === 'rake'
                ? 'bg-amber-900/70 border-amber-400 text-amber-200 shadow-sm'
                : 'bg-[#22160e] border-[#443322] text-[#d7ccc8] hover:bg-[#2d1e14]'
            }`}
          >
            <Shovel className="w-3.5 h-3.5" />
            <span>Bamboo Rake</span>
          </button>

          <button
            id="tool-ripple"
            onClick={() => setActiveTool('ripple')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs transition-all ${
              activeTool === 'ripple'
                ? 'bg-amber-900/70 border-amber-400 text-amber-200 shadow-sm'
                : 'bg-[#22160e] border-[#443322] text-[#d7ccc8] hover:bg-[#2d1e14]'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Water Ripple</span>
          </button>

          <button
            id="tool-stone"
            onClick={() => setActiveTool('stone')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs transition-all ${
              activeTool === 'stone'
                ? 'bg-amber-900/70 border-amber-400 text-amber-200 shadow-sm'
                : 'bg-[#22160e] border-[#443322] text-[#d7ccc8] hover:bg-[#2d1e14]'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Place Stone</span>
          </button>
        </div>

        <div className="text-[11px] font-['Cormorant_Garamond',serif] italic text-[#d7ccc8] hidden sm:block">
          Drag cursor to carve mindful waves in fine sand
        </div>
      </div>
    </div>
  );
};
