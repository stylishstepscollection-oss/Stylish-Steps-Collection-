'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Logo from '@/public/SSC.png';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const isAppStart = !sessionStorage.getItem('appStarted');
    
    if (isAppStart) {
      sessionStorage.setItem('appStarted', 'true');
      setShouldRender(true);
      setIsVisible(true);

      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-gray-950"
        >
          {/* Logo Container - Simplified and Professional */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative flex flex-col items-center"
          >
            {/* Logo - Clean presentation */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-6">
              <Image
                src={Logo}
                alt="Stylish Style Collection"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Brand Name - Elegant Typography */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white tracking-wide mb-1">
                Stylish Style
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                Collection
              </p>
            </motion.div>
          </motion.div>

          {/* Minimal Loading Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-12 sm:bottom-16"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-16 h-0.5 bg-linear-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}