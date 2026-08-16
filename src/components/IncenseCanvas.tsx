import React, { useEffect, useRef, useState } from 'react';
import { Flame, Sparkles, Wind } from 'lucide-react';
import { soundEngine } from '../utils/soundSynthesis';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  wobbleSpeed: number;
  wobbleDistance: number;
  angle: number;
}

export const IncenseCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLit, setIsLit] = useState<boolean>(true);
  const [scent, setScent] = useState<string>('Nag Champa & Mysore Sandalwood (1984 Vintage)');
  const [burnProgress, setBurnProgress] = useState<number>(0.25); // 0 to 1
  const mousePosRef = useRef<{ x: number; y: number; moved: boolean }>({ x: 0, y: 0, moved: false });
  const isLitRef = useRef(isLit);

  useEffect(() => {
    isLitRef.current = isLit;
  }, [isLit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];

    // Resize canvas to display size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        moved: true
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    let frameCount = 0;

    const render = () => {
      frameCount++;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Base coordinates for incense tip
      const tipX = width / 2;
      const baseStickY = height - 35;
      const stickLength = height * 0.45;
      const tipY = baseStickY - stickLength * (1 - burnProgress * 0.4);

      // Spawn smoke particles if lit
      if (isLitRef.current && frameCount % 2 === 0) {
        const particleCount = 2;
        for (let i = 0; i < particleCount; i++) {
          const maxLife = 140 + Math.random() * 80;
          particles.push({
            x: tipX + (Math.random() - 0.5) * 4,
            y: tipY,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -(0.9 + Math.random() * 0.8),
            radius: 2.5 + Math.random() * 3,
            alpha: 0.05,
            maxAlpha: 0.28 + Math.random() * 0.2,
            life: 0,
            maxLife: maxLife,
            color: Math.random() > 0.3 ? '220, 210, 195' : '190, 175, 155',
            wobbleSpeed: 0.02 + Math.random() * 0.03,
            wobbleDistance: 12 + Math.random() * 20,
            angle: Math.random() * Math.PI * 2
          });
        }
      }

      // Update & Draw Smoke Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.angle += p.wobbleSpeed;

        // Upward drift + sinusoidal waft
        p.x += p.vx + Math.sin(p.angle) * (p.wobbleDistance * 0.04);
        p.y += p.vy;
        p.radius += 0.16; // Expands as it cools and wafts

        // Mouse wind turbulence interaction
        if (mousePosRef.current.moved) {
          const dx = p.x - mousePosRef.current.x;
          const dy = p.y - mousePosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const force = (80 - dist) / 80;
            p.vx += (dx / (dist + 0.1)) * force * 1.2;
            p.vy -= force * 0.5;
          }
        }

        // Alpha envelope: fade in, sustain, fade out
        const progress = p.life / p.maxLife;
        if (progress < 0.15) {
          p.alpha = (progress / 0.15) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha * (1 - (progress - 0.15) / 0.85);
        }

        if (p.life >= p.maxLife || p.y < 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw soft smoke puff
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        grad.addColorStop(0.6, `rgba(${p.color}, ${p.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Brass Incense Holder Dish (Authentic vintage brass lotus burner)
      const dishY = height - 20;
      const dishWidth = 140;
      const dishGrad = ctx.createLinearGradient(tipX - dishWidth / 2, dishY, tipX + dishWidth / 2, dishY);
      dishGrad.addColorStop(0, '#5a3d1c');
      dishGrad.addColorStop(0.3, '#c9933e');
      dishGrad.addColorStop(0.5, '#f5d28b');
      dishGrad.addColorStop(0.7, '#a97327');
      dishGrad.addColorStop(1, '#4a2f14');

      ctx.fillStyle = dishGrad;
      ctx.beginPath();
      ctx.ellipse(tipX, dishY, dishWidth / 2, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Brass rim highlight
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Lotus petal engraving hints
      ctx.strokeStyle = 'rgba(70, 40, 10, 0.4)';
      ctx.lineWidth = 1.5;
      for (let offset = -50; offset <= 50; offset += 25) {
        ctx.beginPath();
        ctx.arc(tipX + offset, dishY + 2, 8, 0, Math.PI);
        ctx.stroke();
      }

      // Fallen ash pile in the dish
      ctx.fillStyle = '#948a7b';
      ctx.beginPath();
      ctx.ellipse(tipX + 8, dishY - 2, 26, 4, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Incense Bamboo Core Stick (lower bare wood)
      ctx.strokeStyle = '#b08968';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(tipX, baseStickY);
      ctx.lineTo(tipX, baseStickY - 18);
      ctx.stroke();

      // Sandalwood Masala Paste Layer (fragrant coated body)
      const masalaStart = baseStickY - 18;
      ctx.strokeStyle = '#58311d';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(tipX, masalaStart);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      // Subtle texture lines on incense stick
      ctx.strokeStyle = '#3e2112';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tipX - 1, masalaStart);
      ctx.lineTo(tipX - 1, tipY);
      ctx.stroke();

      // If Lit: Draw Glowing Ember at tip with breathing pulse
      if (isLitRef.current) {
        const pulse = Math.sin(frameCount * 0.08) * 0.3 + 0.7;

        // Orange ember outer halo
        const glowGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 18 * pulse);
        glowGrad.addColorStop(0, 'rgba(255, 140, 0, 0.8)');
        glowGrad.addColorStop(0.3, 'rgba(255, 69, 0, 0.4)');
        glowGrad.addColorStop(0.8, 'rgba(255, 50, 0, 0.1)');
        glowGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 18 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // White-hot core
        ctx.fillStyle = '#fff7ed';
        ctx.beginPath();
        ctx.arc(tipX, tipY, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // White ash tip cap
        ctx.fillStyle = '#d6d3d1';
        ctx.beginPath();
        ctx.arc(tipX, tipY - 1.5, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [burnProgress]);

  const toggleIncense = () => {
    const nextState = !isLit;
    setIsLit(nextState);
    if (nextState) {
      soundEngine.playTingsha();
    }
  };

  const handleFanSmoke = () => {
    soundEngine.playTingsha();
    // Advance burn progress slightly and trigger ash puff
    setBurnProgress(prev => Math.min(prev + 0.08, 0.9));
  };

  return (
    <div id="incense-sanctuary" className="relative flex flex-col items-center bg-[#18130e]/80 border border-[#443322]/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-hidden group">
      {/* Background vintage washi texture gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ffedd5]/5 via-transparent to-black/40 pointer-events-none" />

      {/* Top Header & Scent Badge */}
      <div className="w-full flex items-center justify-between z-10 mb-2 border-b border-[#3d2b1b]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 animate-ping" />
          <h3 className="font-['Marcellus',serif] text-base sm:text-lg text-[#f3e8d2] tracking-wider uppercase">
            Sandalwood & Incense Altar
          </h3>
        </div>
        <button
          id="toggle-incense-btn"
          onClick={toggleIncense}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all duration-300 ${
            isLit
              ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:bg-amber-900/70'
              : 'bg-stone-900/60 border-stone-700 text-stone-400 hover:text-stone-200'
          }`}
          title="Click to light or extinguish the sacred incense"
        >
          <Flame className={`w-3.5 h-3.5 ${isLit ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-stone-500'}`} />
          <span>{isLit ? 'Burning Ember' : 'Extinguished'}</span>
        </button>
      </div>

      {/* Interactive Physics Canvas */}
      <div className="relative w-full h-64 sm:h-72 cursor-crosshair flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          title="Hover or move cursor near the smoke to waft fragrant curls in the breeze"
        />

        {/* Ambient hint on first view */}
        <div className="absolute top-2 right-2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity text-[11px] text-[#bcaaa4] font-['Space_Mono'] flex items-center gap-1">
          <Wind className="w-3 h-3 text-amber-400/80" />
          <span>Waft cursor over smoke</span>
        </div>
      </div>

      {/* Scent & Controls Footer */}
      <div className="w-full mt-3 pt-3 border-t border-[#3d2b1b]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs z-10">
        <div className="flex items-center gap-2 text-[#d7ccc8] font-['Cormorant_Garamond',serif] text-sm italic">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{scent}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="fan-incense-btn"
            onClick={handleFanSmoke}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2a1d13] border border-[#553b26] text-[#e0cfbb] hover:bg-[#3d2a1b] hover:text-amber-300 transition-colors text-[11px]"
            title="Fan the ember with gentle temple air"
          >
            <Wind className="w-3 h-3" />
            <span>Fan Ember</span>
          </button>
          <button
            id="switch-scent-btn"
            onClick={() => {
              const scents = [
                'Nag Champa & Mysore Sandalwood (1984 Vintage)',
                'Tibetan Cedarwood & Himalayan Juniper',
                'Japanese Kyara Agarwood & Star Anise',
                'Vrindavan Rose & Frankincense Resin'
              ];
              const nextIdx = (scents.indexOf(scent) + 1) % scents.length;
              setScent(scents[nextIdx]);
              soundEngine.playTingsha();
            }}
            className="px-2.5 py-1 rounded bg-[#2a1d13] border border-[#553b26] text-[#e0cfbb] hover:bg-[#3d2a1b] hover:text-amber-300 transition-colors text-[11px]"
          >
            Change Scent
          </button>
        </div>
      </div>
    </div>
  );
};
