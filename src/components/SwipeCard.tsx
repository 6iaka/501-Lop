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
  const [showPreview, setShowPreview] = useState(false);
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
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? 'right' : 'left';
      await controls.start({ 
        x: direction === 'right' ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onSwipe(direction);
    } else {
      await controls.start({ 
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
    setDragDirection(null);
  };

  useEffect(() => {
    controls.start({ 
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    });
  }, [item, controls]);

  return (
    <>
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

              <div className="absolute inset-0 bg-gray-800">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', item.imageUrl);
                      e.currentTarget.src = `https://via.placeholder.com/800x200/333333/ffffff?text=${encodeURIComponent(item.name)}`;
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-3xl font-bold mb-2">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-200 text-sm line-clamp-2">{item.description}</p>
                )}
              </div>

              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPreview(true)}
                  className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.button>
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

      {/* Preview Modal */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-48">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', item.imageUrl);
                    e.currentTarget.src = `https://via.placeholder.com/800x200/333333/ffffff?text=${encodeURIComponent(item.name)}`;
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </div>

            <div className="p-6">
              <h2 className="text-3xl font-bold text-white mb-4">{item.name}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Channel ID: {item.channelId}</span>
                </div>

                {item.description && (
                  <div className="text-gray-300">
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-6">
                  <a
                    href={`https://youtube.com/channel/${item.channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    Visit Channel
                  </a>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
} 