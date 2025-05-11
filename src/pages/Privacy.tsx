
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Helmet>
        <title>Privacy Policy - Chetna AI</title>
        <meta name="description" content="Read the privacy policy for Chetna AI - Your Mental Wellness Companion." />
        <link rel="canonical" href="https://chetna.live/privacy" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm rounded-2xl p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-chetna-primary">Privacy Policy for Chetna AI</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">
              Effective Date: 29-03-2025
            </p>
            
            <p className="mb-4">
              At Chetna AI, accessible from https://chetna.live, we are committed to protecting your privacy. 
              This Privacy Policy explains how your personal information is collected, used, and disclosed when you use our services.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            
            <h3 className="text-lg font-medium mt-4 mb-2">a. Personal Information</h3>
            <p className="mb-4">
              When you sign up or interact with Chetna AI, we may collect:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name (optional)</li>
              <li>Email address (via Supabase authentication)</li>
              <li>Posts, journal entries, and feedback you submit</li>
              <li>Device information, IP address, and usage logs</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4 mb-2">b. Sensitive Information</h3>
            <p className="mb-4">
              Chetna AI is a mental health assistant. We may collect sensitive information you voluntarily provide, such as:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Emotional well-being</li>
              <li>Journal entries</li>
              <li>Personal stories and experiences</li>
            </ul>
            <p className="mb-4">
              We do not store chat data with the AI unless explicitly mentioned.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Data</h2>
            <p className="mb-4">
              We use your data to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide personalized AI responses</li>
              <li>Enable community interactions</li>
              <li>Improve user experience</li>
              <li>Monitor usage and ensure security</li>
              <li>Respond to support or feedback</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Sharing & Storage</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>We do not sell or rent your data.</li>
              <li>We may share data with service providers (like Supabase and OpenAI/Mistral AI) strictly for operational purposes.</li>
              <li>Anonymized data may be used for analytics and research.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your data</li>
              <li>Delete or modify your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mb-4">
              Email us at support@chetna.live to request data changes.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures, including encryption and secure authentication. However, no system is 100% secure.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Children's Privacy</h2>
            <p className="mb-4">
              Chetna AI is not intended for use by individuals under 13. If we learn that we have collected personal data from a child, we will delete it promptly.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Updates</h2>
            <p className="mb-4">
              We may update this Privacy Policy periodically. Continued use of the service implies acceptance of the revised policy.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at support@chetna.live
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
