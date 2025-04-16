'use client';

import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface SwipeCardProps {
  item: {
    id: string;
    name: string;
    imageUrl: string;
    description?: string;
  };
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function SwipeCard({ item, onSwipe }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragInfo, setDragInfo] = useState<PanInfo | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const offsetX = info.offset.x;

    if (Math.abs(offsetX) > threshold) {
      handleSwipe(offsetX > 0 ? 'right' : 'left');
    }
    setDragInfo(null);
    setIsDragging(false);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragInfo(info);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    setIsAnimating(true);
    onSwipe(direction);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <motion.div
        ref={cardRef}
        className="relative bg-white rounded-xl shadow-lg overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.95 }}
        style={{ touchAction: 'none' }}
        animate={{
          rotate: dragInfo ? dragInfo.offset.x * 0.05 : 0,
          x: isAnimating ? (dragInfo?.offset.x > 0 ? 500 : -500) : 0,
          opacity: isAnimating ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        <div className="relative h-64">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
          {item.description && (
            <p className="mt-2 text-gray-600 line-clamp-2">{item.description}</p>
          )}
        </div>

        {isDragging && dragInfo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`text-2xl font-bold ${
              dragInfo.offset.x > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {dragInfo.offset.x > 0 ? 'KEEP' : 'REMOVE'}
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => handleSwipe('left')}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Remove
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          Keep
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 