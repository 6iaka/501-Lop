'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getYouTubeSubscriptions, unsubscribeFromChannel } from '../services/youtube';
import SwipeCard from '../components/SwipeCard';
import { motion } from 'framer-motion';

interface Subscription {
  id: string;
  channelId: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!session?.accessToken) {
        console.log('No access token in session');
        return;
      }

      try {
        setIsLoading(true);
        const data = await getYouTubeSubscriptions(session.accessToken);
        setSubscriptions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
        setError('Failed to load subscriptions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchSubscriptions();
    }
  }, [session]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (isUnsubscribing) return;

    const currentSubscription = subscriptions[currentIndex];
    if (!currentSubscription) return;

    if (direction === 'left') {
      try {
        setIsUnsubscribing(true);
        console.log('Unsubscribing from channel:', {
          subscriptionId: currentSubscription.id,
          channelId: currentSubscription.channelId,
          name: currentSubscription.name
        });

        await unsubscribeFromChannel(session?.accessToken!, currentSubscription.id);
        
        // Remove the unsubscribed channel from local state
        setSubscriptions(prev => prev.filter(sub => sub.id !== currentSubscription.id));
        
        // Update current index if we're at the end
        if (currentIndex >= subscriptions.length - 1) {
          setCurrentIndex(Math.max(0, subscriptions.length - 2));
        }
      } catch (err) {
        console.error('Error unsubscribing:', err);
        setError('Failed to unsubscribe. Please try again.');
      } finally {
        setIsUnsubscribing(false);
      }
    } else {
      // Move to next subscription
      setCurrentIndex(prev => Math.min(prev + 1, subscriptions.length - 1));
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-6">YouTube Cleaner</h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Sign in to manage your YouTube subscriptions. Swipe left to remove channels you no longer watch.
          </p>
          <button
            onClick={() => signIn('google')}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          >
            Sign in with Google
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Subscriptions Found</h2>
          <p className="text-gray-400 mb-6">You don't have any YouTube subscriptions to manage.</p>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          >
            Go to YouTube
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">YouTube Cleaner</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">
              {currentIndex + 1} of {subscriptions.length}
            </span>
            <a
              href="/api/auth/signout"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sign out
            </a>
          </div>
        </div>

        <SwipeCard
          item={subscriptions[currentIndex]}
          onSwipe={handleSwipe}
        />
      </div>
    </div>
  );
} 