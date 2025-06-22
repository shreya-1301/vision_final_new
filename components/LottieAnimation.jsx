' ';
import React from 'react';
import Lottie from 'lottie-react';
import animationData1 from '../../public/grayrainbow.json';


const LottieAnimation = ({ width = 250, height = 150, className = '' }) => {
  const isDarkMode = false;

  return (
    <div 
      className={`lottie-container ${className} ${isDarkMode ? 'dark-mode-animation' : ''}`} 
      style={{ width, height }}
    >
      <Lottie 
        animationData={animationData1} 
        loop={true}
        autoplay={true}
      />
      {/* Dark mode  -future use */}
      {/* <style jsx>{`
        .dark-mode-animation :global(svg path),
        .dark-mode-animation :global(svg stroke) {
          stroke: white !important;
          fill: white !important;
        }
        .dark-mode-animation :global(svg circle),
        .dark-mode-animation :global(svg ellipse),
        .dark-mode-animation :global(svg line),
        .dark-mode-animation :global(svg polyline),
        .dark-mode-animation :global(svg rect),
        .dark-mode-animation :global(svg polygon) {
          stroke: white !important;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .dark-mode-animation {
          filter: invert(1) hue-rotate(180deg);
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style> */}
    </div>
  );
};

export default LottieAnimation; 