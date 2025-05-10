
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm rounded-2xl p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-chetna-primary">Terms of Service</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">
              Last Updated: May 10, 2025
            </p>
            
            <p className="mb-4">
              Please read these Terms of Service carefully before using Chetna AI. By accessing or using our application, you agree to be bound by these Terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Use of Service</h2>
            <p className="mb-4">
              Chetna AI provides a mental wellness companion service. You agree to use our service only for lawful purposes and in accordance with these Terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Changes to Terms</h2>
            <p className="mb-4">
              We may revise these Terms from time to time. The most current version will always be posted on our website.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at support@chetna-ai.com
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
