'use client';

import React, { useState, useEffect } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';

interface SwipeCardProps {
  item: {
    id: string;
    channelId: string;
    name: string;
    imageUrl: string;
    description?: string;
  };
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function SwipeCard({ item, onSwipe }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const controls = useAnimation();

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    if (Math.abs(offset) > 50) {
      setDragDirection(offset > 0 ? 'right' : 'left');
    } else {
      setDragDirection(null);
    }
  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // minimum distance to trigger swipe
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? 'right' : 'left';
      // Animate the card out of view
      await controls.start({ 
        x: direction === 'right' ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onSwipe(direction);
    } else {
      // Animate back to center
      await controls.start({ 
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
    setDragDirection(null);
  };

  // Reset position when item changes
  useEffect(() => {
    controls.start({ 
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    });
  }, [item, controls]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="relative w-full max-w-sm h-[600px]">
        <motion.div
          className="absolute w-full h-full cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -300, right: 300 }}
          dragElastic={0.7}
          onDragStart={() => setIsDragging(true)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
            {/* Swipe direction indicators */}
            <motion.div
              className="absolute inset-0 rounded-3xl z-10 pointer-events-none"
              animate={{
                backgroundColor: dragDirection === 'right' 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : dragDirection === 'left' 
                    ? 'rgba(239, 68, 68, 0.2)' 
                    : 'transparent'
              }}
              transition={{ duration: 0.2 }}
            />

            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-3xl font-bold mb-2">{item.name}</h3>
              {item.description && (
                <p className="text-gray-200 text-sm line-clamp-2">{item.description}</p>
              )}
            </div>

            <div className="absolute top-4 right-4">
              <div className="bg-black/50 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              controls.start({ 
                x: -500,
                opacity: 0,
                transition: { duration: 0.3 }
              }).then(() => onSwipe('left'));
            }}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              controls.start({ 
                x: 500,
                opacity: 0,
                transition: { duration: 0.3 }
              }).then(() => onSwipe('right'));
            }}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-green-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
} 