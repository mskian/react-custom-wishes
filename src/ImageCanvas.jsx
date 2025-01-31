import { useEffect, useRef, useState } from "react";
import { FaDownload } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const ImageCanvas = ({ image, text }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);

  const font = "700 28pt Anek Tamil";
  const color = "#ffeaa7";
  const textX = 540;
  const textY = 800;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      setContext(ctx);
    }
  }, []);

  useEffect(() => {
    if (!context || !image) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      if (!canvasRef.current || !context) return;

      const canvas = canvasRef.current;
      canvas.width = 1080;
      canvas.height = 1080;

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      context.font = font;
      context.fillStyle = color;
      context.textAlign = "center";

      context.fillText(text, textX, textY);
    };
  }, [context, image, text]);

  const generateRandomFilename = () => {
    const randomString = Math.random().toString(36).substring(2, 15);
    return `greeting-wish-${randomString}.png`;
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = generateRandomFilename();
    link.click();
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef}></canvas>
      <br />
      <div style={{ textAlign: "center" }}>
        <button className="button is-success is-small" onClick={downloadImage}>
        <FaDownload size={10} />&nbsp;Download Image
        </button>
      </div>
      </div>
  );
};

export default ImageCanvas;
