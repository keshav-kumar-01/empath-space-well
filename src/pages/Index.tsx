
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSection from "@/components/IntroSection";
import ChatInterface from "@/components/ChatInterface";
import { MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'community'>('chat');

  const startChat = () => {
    setShowIntro(false);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          {showIntro ? (
            <IntroSection onStartChat={startChat} />
          ) : (
            <div className="flex flex-col">
              <div className="flex justify-center mb-6 bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm rounded-full p-1 shadow-md self-center">
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'ghost'}
                  className={`rounded-full ${
                    activeTab === 'chat' 
                      ? 'bg-gradient-to-r from-chetna-primary to-chetna-primary/90' 
                      : ''
                  }`}
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Chetna
                </Button>
                <Link to="/community">
                  <Button
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Community
                  </Button>
                </Link>
              </div>
              
              <div className="w-full">
                {activeTab === 'chat' && <ChatInterface />}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
