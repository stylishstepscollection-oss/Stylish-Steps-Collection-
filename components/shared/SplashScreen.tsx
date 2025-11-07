'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Logo from '@/public/SSC.png';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true); // Start visible
  const [shouldRender, setShouldRender] = useState(true); // Start rendering

  useEffect(() => {
    const isAppStart = !sessionStorage.getItem('appStarted');
    
    if (isAppStart) {
      sessionStorage.setItem('appStarted', 'true');
      
      // Longer display time - 3 seconds before fade
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 4500);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(removeTimer);
      };
    } else {
      // If app already started, hide immediately
      setShouldRender(false);
      setIsVisible(false);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }} // Start fully visible
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-gray-950"
        >
          {/* Logo Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative flex flex-col items-center"
          >
            {/* Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-6">
              <Image
                src={Logo}
                alt="Stylish Steps Collection"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white tracking-wide mb-1">
                Stylish Steps
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                Collection
              </p>
            </motion.div>
          </motion.div>

          {/* Loading Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
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