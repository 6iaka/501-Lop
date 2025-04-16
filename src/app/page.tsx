'use client';

import { useState, useEffect } from 'react';
import SwipeCard from '../components/SwipeCard';
import { useSession, signIn, signOut } from 'next-auth/react';
import { getYouTubeSubscriptions, unsubscribeFromChannel } from '../services/youtube';

interface Subscription {
  id: string;
  channelId: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  useEffect(() => {
    async function fetchSubscriptions() {
      if (session?.accessToken) {
        console.log('Session:', {
          user: session.user,
          expires: session.expires,
          hasAccessToken: !!session.accessToken,
          tokenLength: session.accessToken?.length
        });
        
        setIsLoading(true);
        setError(null);
        try {
          const data = await getYouTubeSubscriptions(session.accessToken);
          console.log('Fetched subscriptions:', data);
          setSubscriptions(data);
          setCurrentIndex(0); // Reset index when fetching new subscriptions
        } catch (err: any) {
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            response: err.response?.data
          });
          setError(err.message || 'Failed to fetch subscriptions. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No access token in session:', {
          hasSession: !!session,
          status: status,
          user: session?.user
        });
        setSubscriptions([]); // Clear subscriptions when no session
        setCurrentIndex(0); // Reset index
      }
    }

    if (status === 'authenticated') {
      fetchSubscriptions();
    } else if (status === 'unauthenticated') {
      setSubscriptions([]); // Clear subscriptions when signed out
      setCurrentIndex(0); // Reset index
    }
  }, [session, status]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'left' && session?.accessToken) {
      try {
        setIsUnsubscribing(true);
        const currentSubscription = subscriptions[currentIndex];
        console.log('Attempting to unsubscribe from:', {
          name: currentSubscription.name,
          subscriptionId: currentSubscription.id,
          channelId: currentSubscription.channelId
        });
        
        await unsubscribeFromChannel(session.accessToken, currentSubscription.id);
        console.log('Successfully unsubscribed from:', currentSubscription.name);
        
        // Remove the unsubscribed channel from the local state
        setSubscriptions(prev => prev.filter(sub => sub.id !== currentSubscription.id));
      } catch (err: any) {
        console.error('Error unsubscribing:', err);
        setError('Failed to unsubscribe. Please try again.');
      } finally {
        setIsUnsubscribing(false);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-6 text-blue-600">Swipe Cleaner</h1>
          <p className="text-lg mb-8 text-gray-600">
            Clean up your digital life with a simple swipe
          </p>
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No Subscriptions Found</h1>
        <p className="text-gray-600 mb-4">You don't have any YouTube subscriptions to clean up.</p>
        <button
          onClick={() => signOut()}
          className="text-blue-500 hover:text-blue-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  if (currentIndex >= subscriptions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6 text-green-600">All Done! 🎉</h1>
          <p className="text-lg mb-8 text-gray-600">
            You've gone through all your subscriptions
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setCurrentIndex(0)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Start Over
            </button>
            <button
              onClick={() => signOut()}
              className="text-gray-600 hover:text-gray-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Swipe Cleaner</h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentIndex + 1} of {subscriptions.length} subscriptions
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-gray-600 hover:text-gray-800"
          >
            Sign Out
          </button>
        </div>

        <SwipeCard
          item={subscriptions[currentIndex]}
          onSwipe={handleSwipe}
        />
      </div>
    </div>
  );
} 