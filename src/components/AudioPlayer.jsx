import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const AudioPlayer = ({ src, title }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        autoPlay
        loop
        muted={false}
      />
      <p className="audio-title">{title}</p>

      <button className="play-button" onClick={togglePlay}>
        {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
      </button>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="duration-container">
        <span className="current-time">{`${Math.floor(
          (audioRef.current?.currentTime || 0) / 60
        )}:${Math.floor((audioRef.current?.currentTime || 0) % 60)
          .toString()
          .padStart(2, "0")}`}</span>
        <span className="total-duration">{`${Math.floor(duration / 60)}:${Math.floor(duration % 60)
          .toString()
          .padStart(2, "0")}`}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
