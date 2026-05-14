import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ButterflyBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const colors = ["#d4bce2", "#c1a5d1", "#ffffff", "#a389b3", "#836197"];
    const NUM_BUTTERFLIES = 8;

    const butterflies = d3.range(NUM_BUTTERFLIES).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      angle: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      flap: 0,
      flapSpeed: 0.1 + Math.random() * 0.1,
      size: 15 + Math.random() * 15, // Base size
      particles: []
    }));

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      butterflies.forEach(b => {
        // Update Position
        b.angle += (Math.random() - 0.5) * 0.2;
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;
        b.flap += b.flapSpeed;

        // Screen Wrap
        if (b.x < -50) b.x = window.innerWidth + 50;
        if (b.x > window.innerWidth + 50) b.x = -50;
        if (b.y < -50) b.y = window.innerHeight + 50;
        if (b.y > window.innerHeight + 50) b.y = -50;

        // Draw Trail (Glitter)
        if (Math.random() > 0.5) {
            b.particles.push({ x: b.x, y: b.y, life: 1, s: Math.random() * 3 });
        }
        
        b.particles.forEach((p, i) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            ctx.fill();
            p.life -= 0.02;
            if (p.life <= 0) b.particles.splice(i, 1);
        });

        // Draw Butterfly
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle + Math.PI / 2);
        
        const wingWidth = Math.abs(Math.sin(b.flap)) * b.size;
        ctx.fillStyle = b.color;
        
        // Right Wing
        ctx.beginPath();
        ctx.ellipse(wingWidth/2, 0, wingWidth/2, b.size, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Left Wing
        ctx.beginPath();
        ctx.ellipse(-wingWidth/2, 0, wingWidth/2, b.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = "#4a3b52";
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, b.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
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
        zIndex: 1, // Stay behind the card (which is 10)
        pointerEvents: 'none'
      }}
    />
  );
};

export default ButterflyBackground;