# YouTube Subscription Cleaner

A mobile-friendly web application that helps you clean up your YouTube subscriptions through a simple swipe interface.

## Features

- 🔐 Secure Google OAuth authentication
- 📱 Mobile-first design with swipe gestures
- 🔄 Real-time subscription management
- 🎨 Beautiful UI with smooth animations
- 📊 View all your YouTube subscriptions

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- NextAuth.js
- YouTube Data API v3

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is deployed on Vercel. Visit the live site at: [https://youtube-subscription-cleaner.vercel.app](https://youtube-subscription-cleaner.vercel.app)

## Contributing

Feel free to submit issues and enhancement requests! 