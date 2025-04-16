'use client';

import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import { motion } from 'framer-motion';

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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwipe = (direction: string) => {
    if (direction === 'left' || direction === 'right') {
      setIsAnimating(true);
      onSwipe(direction as 'left' | 'right');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="relative w-full max-w-sm h-[600px]">
        <TinderCard
          className="absolute w-full h-full"
          onSwipe={handleSwipe}
          preventSwipe={['up', 'down']}
        >
          <motion.div
            className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl"
            initial={{ scale: 1 }}
            animate={isAnimating ? { scale: 0.95 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        </TinderCard>

        <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-8">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-green-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 