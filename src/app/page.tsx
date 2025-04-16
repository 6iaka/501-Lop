'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getYouTubeSubscriptions, unsubscribeFromChannel } from '../services/youtube';
import SwipeCard from '../components/SwipeCard';
import Script from 'next/script';

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
        await unsubscribeFromChannel(session?.accessToken!, currentSubscription.id);
        
        // Remove the unsubscribed channel and update index
        setSubscriptions(prev => {
          const newSubscriptions = prev.filter(sub => sub.id !== currentSubscription.id);
          // If we're at the end of the list, go back one
          if (currentIndex >= newSubscriptions.length) {
            setCurrentIndex(Math.max(0, newSubscriptions.length - 1));
          }
          return newSubscriptions;
        });
      } catch (err) {
        console.error('Error unsubscribing:', err);
        setError('Failed to unsubscribe. Please try again.');
      } finally {
        setIsUnsubscribing(false);
      }
    } else {
      // Move to next subscription if there are more
      if (currentIndex < subscriptions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // If we're at the end, go back to the beginning
        setCurrentIndex(0);
      }
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-6">YouTube Cleaner</h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Sign in to manage your YouTube subscriptions. Swipe left to remove channels you no longer watch.
          </p>
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors w-64 justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              Sign in with Google
            </button>
            <button
              onClick={() => alert('TikTok integration coming soon!')}
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors w-64 justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              Sign in with TikTok
            </button>
          </div>
        </div>
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <Script src="/register-sw.js" strategy="afterInteractive" />
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

        {subscriptions[currentIndex] && (
          <SwipeCard
            item={subscriptions[currentIndex]}
            onSwipe={handleSwipe}
          />
        )}
      </div>
    </main>
  );
} 