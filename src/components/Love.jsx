import { useCallback, useState } from 'react';
import confetti from 'canvas-confetti';
import { FaHeart } from 'react-icons/fa';

export default function HeartConfetti() {
  const [isAnimating, setIsAnimating] = useState(false);

  const fireHeartConfetti = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) {
        setIsAnimating(false);
        return;
      }

      confetti({
        particleCount: 8,
        spread: 70,
        startVelocity: 30,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#ff0055', '#ff66a3', '#ff3385'],
        shapes: ['circle'],
        scalar: 1.2,
        ticks: 100,
        decay: 0.92,
      });

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, [isAnimating]);

  return (
    <div>
      <button
        className="button is-warning is-rounded is-small mt-2 mb-5"
        onClick={fireHeartConfetti}
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={e => (e.target.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.target.style.transform = 'scale(1)' )}
      >
        <span className="icon">
          <FaHeart />
        </span>
        <span>Spread Love</span>
      </button>
    </div>
  );
}
