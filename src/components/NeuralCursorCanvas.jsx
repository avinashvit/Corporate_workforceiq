import React, { useEffect, useRef } from 'react';

/**
 * Interactive Neural Constellation Canvas (Gold & White Theme)
 * Renders floating workforce intelligence nodes in brilliant gold and crisp white
 * that dynamically link, illuminate, and respond to cursor movement.
 */
export default function NeuralCursorCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = {
      x: null,
      y: null,
      radius: 180,
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Generate Gold and White particles
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const particles = [];
    const colors = ['#FFFFFF', '#FEF08A', '#FDE68A', '#FBBF24', '#F59E0B', '#FDF8E2'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.5 + 0.35,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off canvas edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Particle to mouse interaction
        let mouseDist = Infinity;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          mouseDist = Math.sqrt(dx * dx + dy * dy);

          if (mouseDist < mouse.radius) {
            // Interactive connection line from particle to cursor in rich Gold
            const connectionAlpha = (1 - mouseDist / mouse.radius) * 0.85;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${connectionAlpha})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Subtle attraction towards cursor
            const force = (mouse.radius - mouseDist) / mouse.radius;
            p.x += (dx / mouseDist) * force * 0.6;
            p.y += (dy / mouseDist) * force * 0.6;
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = mouseDist < mouse.radius ? 14 : 5;
        ctx.globalAlpha = mouseDist < mouse.radius ? 1 : p.baseAlpha;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Inter-particle connection lines in subtle gold/champagne
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxDist = 110;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / maxDist) * 0.22;
            ctx.strokeStyle = `rgba(251, 191, 36, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Draw cursor ambient glow ring in radiant Gold & White
      if (mouse.x !== null && mouse.y !== null) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
        gradient.addColorStop(0.45, 'rgba(254, 240, 138, 0.06)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
