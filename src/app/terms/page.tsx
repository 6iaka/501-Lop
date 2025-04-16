'use client';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using 501-Lop, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            501-Lop is a web application that helps users manage their YouTube subscriptions. The service allows users to view and manage their YouTube channel subscriptions through a simple interface.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="mb-4">
            As a user of 501-Lop, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate information when using the service</li>
            <li>Use the service in compliance with YouTube's Terms of Service</li>
            <li>Not use the service for any illegal purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Service Limitations</h2>
          <p className="mb-4">
            The service is provided "as is" and "as available". We make no warranties, expressed or implied, and hereby disclaim all warranties of any kind.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date of these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at siakadiarra014@gmail.com
          </p>
        </section>

        <p className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 