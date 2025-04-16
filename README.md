# Swipe Cleaner 🧹

A fun and simple mobile-friendly app that helps you clean up your digital life by swiping left or right through your YouTube subscriptions and Instagram followings.

## Features

- 🔐 Google Authentication
- 👆 Swipe-based interface
- 📱 Mobile-friendly design
- 🎯 Easy subscription management
- 📊 Progress tracking

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/swipe-cleaner.git
cd swipe-cleaner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your-secret-key-here
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```

4. Get Google OAuth credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Sign in with your Google account
2. Swipe right to keep a subscription
3. Swipe left to remove a subscription
4. Track your progress with the counter at the top

## Built With

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 