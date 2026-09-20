import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroVideoProps {
  onComplete: () => void;
}

const images = [
  '/pre/CI1A8240.jpg',
  '/pre/CI1A8247.jpg',
  '/pre/CI1A8346.jpg',
  '/pre/CI1A8350.jpg',
  '/pre/CI1A8385.jpg',
  '/pre/CI1A8379.jpg',
];

export const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    // Images fall one by one. Hold them for a bit.
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 4500);

    // Call onComplete after exit animation finishes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {images.map((src, index) => {
          const rotations = [-12, 8, -6, 10, -8, 12];
          const xOffsets = [-50, 40, -20, 30, -30, 40];
          const colors = ["#38bdf8", "#7dd3fc", "#0369a1", "#0284c7", "#bae6fd"];

          return (
            <motion.div
              key={src}
              initial={{ y: "-120vh", rotate: rotations[index], x: xOffsets[index], opacity: 1 }}
              animate={{
                y: phase === 'enter' ? 0 : "120vh",
                rotate: rotations[index],
                x: xOffsets[index]
              }}
              transition={{
                y: phase === 'enter'
                  ? { delay: index * 0.4, duration: 1.2, type: "spring", bounce: 0.3 }
                  : { duration: 1, ease: "easeInOut" } // Exit simultaneously
              }}
              className="absolute w-64 h-80 sm:w-[28rem] sm:h-[36rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 sm:p-5 pb-8 sm:pb-12 rounded-sm"
              style={{ zIndex: index + 10, backgroundColor: colors[index % colors.length] }}
            >
              <div className="w-full h-full relative overflow-hidden rounded-sm">
                <img src={src} alt={`Intro ${index}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

    </div>
  );
};
