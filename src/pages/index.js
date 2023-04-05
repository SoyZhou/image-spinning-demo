// pages/index.js
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const Image360 = ({ images }) => {
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [startX, setStartX] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseEnter = () => {
    setIsHovering(true);
  };

  const onMouseLeave = () => {
    setIsHovering(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    if (!containerRef.current) return;

    const deltaX = e.clientX - startX;
    const frameDelta = -Math.round(deltaX / 10);
    const newFrame = (currentFrame + frameDelta + images.length) % images.length;

    setCurrentFrame(newFrame);
    setStartX(e.clientX);
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [containerRef, images, currentFrame, isDragging, startX]);

  // Add auto-rotation
  useEffect(() => {
    const autoRotate = () => {
      if (isHovering && !isDragging) {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % images.length);
      }
    };

    const timer = setInterval(autoRotate, 100); // Adjust the rotation speed here (100ms)

    return () => {
      clearInterval(timer);
    };
  }, [images, isDragging, isHovering]);

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ width: '100%', position: 'relative', userSelect: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {images.map((src, index) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '300px',
            height: '400px',
            display: index === currentFrame ? 'block' : 'none',
            background: 'white',
          }}
        >
          <Image src={src} alt="" width={300} height={400} draggable={false} />
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const imagePathPrefix = 'https://verdantnft-repo.s3.ap-southeast-1.amazonaws.com/test/ccb-ghostbtl'; // Change this to your image path prefix
  const images = Array.from({ length: 24 }, (_, i) => {
    const imageNumber = String(i + 1).padStart(3, '0');
    return `${imagePathPrefix}${imageNumber}.jpg`; // Change the file extension if necessary
  });

  return (
    <div style={{ width: 300, height: 400, margin: '0 auto', overflow: 'hidden' }}>
      <Image360 images={images} />
    </div>
  );
}
