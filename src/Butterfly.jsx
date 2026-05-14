import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ButterflyBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // A magical Fairy Garden palette
    const colors = ["#d4bce2", "#c1a5d1", "#ffffff", "#e1bee7", "#f3e5f5"];
    const NUM_BUTTERFLIES = 15; // Increased for your high-end build

    const butterflies = d3.range(NUM_BUTTERFLIES).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      angle: Math.random() * Math.PI * 2,
      speed: 0.8 + Math.random() * 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      flap: Math.random() * Math.PI,
      flapSpeed: 0.15 + Math.random() * 0.1,
      size: 12 + Math.random() * 10,
      particles: []
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      butterflies.forEach(b => {
        // 1. Natural, erratic movement logic
        b.angle += (Math.random() - 0.5) * 0.15;
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;
        b.flap += b.flapSpeed;

        // Screen Wrap logic
        if (b.x < -100) b.x = window.innerWidth + 100;
        if (b.x > window.innerWidth + 100) b.x = -100;
        if (b.y < -100) b.y = window.innerHeight + 100;
        if (b.y > window.innerHeight + 100) b.y = -100;

        // 2. Stardust Trail Logic (Glitter)
        if (Math.random() > 0.4) {
          b.particles.push({ 
            x: b.x, 
            y: b.y, 
            life: 1.0, 
            size: Math.random() * 2.5,
            drift: (Math.random() - 0.5) * 0.5 
          });
        }
        
        b.particles.forEach((p, i) => {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = b.color;
          // Add a sparkle effect based on time
          const twinkle = p.size * (0.5 + Math.abs(Math.sin(Date.now() * 0.01)));
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, twinkle, 0, Math.PI * 2);
          ctx.fill();
          
          p.y += 0.3; // Gravity effect on dust
          p.x += p.drift;
          p.life -= 0.012;
          if (p.life <= 0) b.particles.splice(i, 1);
        });

        // 3. Draw Detailed Butterfly
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle + Math.PI / 2);
        
        // Add Glow / Aura
        ctx.shadowBlur = 12;
        ctx.shadowColor = b.color;
        
        const wingWidth = Math.abs(Math.sin(b.flap)) * b.size;
        ctx.fillStyle = b.color;
        
        // Draw Right Wings (Top & Bottom)
        ctx.beginPath();
        ctx.ellipse(wingWidth/2, -b.size/3, wingWidth/2, b.size/1.8, 0, 0, Math.PI * 2);
        ctx.ellipse(wingWidth/2.5, b.size/3, wingWidth/3, b.size/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw Left Wings (Top & Bottom)
        ctx.beginPath();
        ctx.ellipse(-wingWidth/2, -b.size/3, wingWidth/2, b.size/1.8, 0, 0, Math.PI * 2);
        ctx.ellipse(-wingWidth/2.5, b.size/3, wingWidth/3, b.size/2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Butterfly Body
        ctx.shadowBlur = 0; // Remove glow for body
        ctx.fillStyle = "#3a2b42";
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.5, b.size * 0.7, 0, 0, Math.PI * 2);
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
      className="butterfly-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, 
        pointerEvents: 'none',
        background: 'radial-gradient(circle at center, #9471ab 0%, #836197 100%)'
      }}
    />
  );
};

export default ButterflyBackground;