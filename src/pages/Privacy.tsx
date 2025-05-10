
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm rounded-2xl p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-chetna-primary">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">
              Last Updated: May 10, 2025
            </p>
            
            <p className="mb-4">
              At Chetna AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us when you use our application, including personal information such as your name, email address, and any other information you choose to provide.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect Chetna AI and our users.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at support@chetna-ai.com
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
