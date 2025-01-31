import { useRef, useCallback, useState } from 'react';
import confetti from 'canvas-confetti';
import { FaFire } from 'react-icons/fa';

export default function Confetti() {
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const fireConfetti = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    const animation = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    const particles = [
      { particleCount: 100, spread: 26, startVelocity: 55 },
      { particleCount: 100, spread: 60 },
      { particleCount: 100, spread: 100, decay: 0.91, scalar: 0.8 },
      { particleCount: 100, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 },
      { particleCount: 100, spread: 120, startVelocity: 45 },
    ];

    particles.forEach((config, index) => {
      setTimeout(() => {
        animation({
          ...config,
          origin: { y: 0.7 },
        });
      }, index * 150);
    });

    setTimeout(() => setIsAnimating(false), 4000);
  }, [isAnimating]);

  return (
    <div>
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'all 0.2s ease-out',
        }}
      />
      
      {/* Fire Button with Bulma styling and React Icon */}
      <button
        className="button is-danger is-rounded is-small mt-2 mb-5"
        onClick={fireConfetti}
        style={{
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => (e.target.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.target.style.transform = 'scale(1)')}
      >
        <span className="icon">
          <FaFire />
        </span>
        <span>Celebrate</span>
      </button>
    </div>
  );
}
