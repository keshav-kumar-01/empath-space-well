
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Helmet>
        <title>Terms of Service - Chetna AI</title>
        <meta name="description" content="Read the terms of service for Chetna AI - Your Mental Wellness Companion." />
        <link rel="canonical" href="https://chetna.live/terms" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm rounded-2xl p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-chetna-primary">Terms and Conditions</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">
              Effective Date: 29-03-2025
            </p>
            
            <p className="mb-4">
              Welcome to Chetna AI. By accessing our platform, you agree to the following terms and conditions:
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using Chetna AI, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Use of the Service</h2>
            <p className="mb-4">
              Chetna AI is designed for emotional support and self-reflection. It does not replace licensed medical, psychological, or psychiatric advice.
            </p>
            <p className="mb-4">
              You agree:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Not to use the platform for illegal activities</li>
              <li>Not to upload harmful, abusive, or explicit content</li>
              <li>To use the AI and community features responsibly</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. User Content</h2>
            <p className="mb-4">
              You retain ownership of the content you post. However, by submitting content, you grant us a non-exclusive, royalty-free license to use it for display, improvement, and community interaction (such as upvotes and replies).
            </p>
            <p className="mb-4">
              You are solely responsible for the content you submit.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Account Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate accounts for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violating these terms</li>
              <li>Posting harmful or illegal content</li>
              <li>Misusing AI or community features</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Disclaimer</h2>
            <p className="mb-4">
              Chetna AI is an AI-powered support tool and does not provide real-time crisis support or certified therapy. If you're in distress, please contact a licensed professional or a mental health helpline.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
            <p className="mb-4">
              We are not liable for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Emotional distress resulting from the AI's output</li>
              <li>Decisions made based on AI suggestions</li>
              <li>Data breaches beyond our control</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Modifications</h2>
            <p className="mb-4">
              We may update these Terms at any time. Continued use implies acceptance of the changes.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Contact</h2>
            <p className="mb-4">
              For questions or support, contact us at:
            </p>
            <p className="mb-4">
              📧 <a href="mailto:keshavkumarhf@gmail.com" className="text-chetna-primary hover:text-chetna-accent transition-colors">keshavkumarhf@gmail.com</a>
            </p>
            <p className="mb-4">
              🌐 <a href="https://chetna.live" className="text-chetna-primary hover:text-chetna-accent transition-colors">https://chetna.live</a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
