import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const Image360 = ({ images }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const imageElements = images.map((src) => {
      const img = new Image();
      img.src = src;
      container.appendChild(img);
      return img;
    });

    let currentFrame = 0;
    let isDragging = false;
    let startX = 0;

    const updateFrame = () => {
      imageElements.forEach((img, index) => {
        img.style.display = index === currentFrame ? 'block' : 'none';
      });
    };

    container.addEventListener('mousedown', (event) => {
      isDragging = true;
      startX = event.clientX;
    });

    window.addEventListener('mousemove', (event) => {
      if (!isDragging) return;

      const deltaX = event.clientX - startX;
      const frameDelta = Math.round(deltaX / 10);

      currentFrame = (currentFrame + frameDelta + images.length) % images.length;
      startX = event.clientX;

      updateFrame();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    updateFrame();
  }, [containerRef, images]);

  return <div id="image-container" ref={containerRef} />;
};

export default Image360;