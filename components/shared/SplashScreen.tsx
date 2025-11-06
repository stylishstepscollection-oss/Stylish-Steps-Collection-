'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Logo from '@/public/SSC.png';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if this is a fresh app start (not just a refresh)
    const isAppStart = !sessionStorage.getItem('appStarted');
    
    if (isAppStart) {
      // Mark app as started for this session
      sessionStorage.setItem('appStarted', 'true');
      setShouldRender(true);
      setIsVisible(true);

      // Fade out after 2 seconds
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      // Remove from DOM after animation completes
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 2500);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary"
        >
          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.6, 1],
              ease: 'easeOut',
            }}
            className="relative"
          >
            {/* Pulsing background effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-accent-gold/20 rounded-full blur-3xl"
            />

            {/* Logo */}
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
              }}
              className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <Image
                src={Logo}
                alt="Stylish Style Collection"
                fill
                className="object-contain p-4"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Brand Name (subtle, fades in late) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-20 text-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
              Stylish Style
            </h1>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-10"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}