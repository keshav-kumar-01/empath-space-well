
import React, { useState } from "react";
import Header from "@/components/Header";
import IntroSection from "@/components/IntroSection";
import ChatInterface from "@/components/ChatInterface";

const Index: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  const startChat = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-dark/80">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {showIntro ? (
            <IntroSection onStartChat={startChat} />
          ) : (
            <ChatInterface />
          )}
        </div>
      </main>
      
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Chetna_Ai - Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
};

export default Index;
