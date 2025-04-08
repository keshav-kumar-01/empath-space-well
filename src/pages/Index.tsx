
import React, { useState } from "react";
import Header from "@/components/Header";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-dark/80">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {showIntro ? (
            <IntroSection onStartChat={startChat} />
          ) : (
            <div>
              <div className="flex justify-center mb-6 bg-white dark:bg-card rounded-full p-1 shadow-md">
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'ghost'}
                  className={`rounded-full ${activeTab === 'chat' ? 'bg-chetna-primary' : ''}`}
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
              
              {activeTab === 'chat' && <ChatInterface />}
            </div>
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
