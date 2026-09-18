import { useEffect, useRef } from 'react';

export function CursorEffects({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; star: boolean; rotation: number };
    let particles: Particle[] = [];
    let frame = 0;
    let lastTime = 0;
    let lastMove = 0;
    const colors = ['#ffe99a', '#ffb0e0', '#c7b5ff', '#a7efff'];
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.67 || 1, 3);
      lastTime = now;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles = particles.filter((particle) => particle.life > 0);
      for (const particle of particles) {
        particle.life -= delta;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.vy += 0.025 * delta;
        context.save();
        context.globalAlpha = Math.max(0, particle.life / particle.max);
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation + (particle.max - particle.life) * 0.035);
        context.fillStyle = particle.color;
        context.shadowColor = particle.color;
        context.shadowBlur = 7;
        context.beginPath();
        if (particle.star) {
          for (let point = 0; point < 10; point++) {
            const angle = point * Math.PI / 5 - Math.PI / 2;
            const radius = point % 2 ? particle.size * 0.42 : particle.size;
            context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
          context.closePath();
        } else context.arc(0, 0, particle.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
      frame = particles.length ? requestAnimationFrame(draw) : 0;
    };
    const emit = (event: PointerEvent, burst: boolean) => {
      if (event.pointerType === 'touch' || document.hidden) return;
      if (!burst && event.timeStamp - lastMove < 22) return;
      lastMove = event.timeStamp;
      for (let i = 0; i < (burst ? 14 : 2); i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 1.3 + Math.random() * 3.5 : 0.35;
        const life = burst ? 32 + Math.random() * 12 : 20;
        particles.push({ x: event.clientX, y: event.clientY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life, max: life, size: burst ? 3 + Math.random() * 5 : 1.5 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)], star: burst || Math.random() > 0.7, rotation: angle });
      }
      particles = particles.slice(-150);
      if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(draw); }
    };
    const move = (event: PointerEvent) => emit(event, false);
    const click = (event: PointerEvent) => { if (event.button === 0) emit(event, true); };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', click, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', click);
    };
  }, [enabled]);
  return enabled ? <canvas ref={canvasRef} className="cursor-effects" aria-hidden="true" /> : null;
}
