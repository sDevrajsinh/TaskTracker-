// src/components/ui/Confetti.jsx
import { useRef, useImperativeHandle, forwardRef } from 'react';

const Confetti = forwardRef(function Confetti(_, ref) {
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    fire() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.display = 'block';

      const pieces = Array.from({ length: 70 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 60,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        tilt: Math.random() * 10 - 10,
      }));

      let frame = 0;
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach((p) => {
          p.y += Math.cos(p.d) + 1.2 + p.r / 2;
          p.tilt += 0.1;
          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.moveTo(p.x + p.tilt + p.r / 3, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 5);
          ctx.stroke();
        });
        frame++;
        if (frame < 130) requestAnimationFrame(draw);
        else canvas.style.display = 'none';
      }
      draw();
    },
  }));

  return (
    <canvas
      id="confetti-canvas"
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'none' }}
    />
  );
});

export default Confetti;
