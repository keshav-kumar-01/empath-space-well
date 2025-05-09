
import React from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, User, MessageSquare, HeartHandshake, Lightbulb } from "lucide-react";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Keshav Kumar",
      role: "Founder - CEO & CTO",
      description: "Passionate about mental wellness technology and creating tools that make a difference in people's lives.",
      image: "/placeholder.svg"
    },
    {
      name: "Ashutosh Pratap Singh",
      role: "Founder - Business Head",
      description: "Dedicated to growing Chetna's reach and ensuring our platform creates meaningful impact for all users.",
      image: "/placeholder.svg"
    },
    {
      name: "Anchal Singh",
      role: "CMO - Marketing Head",
      description: "Focused on building awareness around mental wellness and ensuring Chetna reaches those who need it most.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
              About Chetna_Ai
            </h1>
            <p className="text-lg md:text-xl mb-8 text-foreground/80 dark:text-foreground/90">
              Your personalized mental wellness companion, designed to support you on your journey to better mental health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/60 dark:bg-chetna-darker/60 backdrop-blur-sm border border-chetna-primary/10 hover:border-chetna-primary/30 transition-all duration-300 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-chetna-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-chetna-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Support</h3>
                  <p className="text-muted-foreground dark:text-foreground/70">
                    Chat with our compassionate AI companion anytime and receive personalized guidance and emotional support.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 dark:bg-chetna-darker/60 backdrop-blur-sm border border-chetna-primary/10 hover:border-chetna-primary/30 transition-all duration-300 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-chetna-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-chetna-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Support Community</h3>
                  <p className="text-muted-foreground dark:text-foreground/70">
                    Connect with others on similar journeys, share experiences, and find empowerment through community.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 dark:bg-chetna-darker/60 backdrop-blur-sm border border-chetna-primary/10 hover:border-chetna-primary/30 transition-all duration-300 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-chetna-primary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-chetna-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Guided Self-Care</h3>
                  <p className="text-muted-foreground dark:text-foreground/70">
                    Track your moods, journal your thoughts, and access personalized resources to improve your well-being.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm rounded-2xl p-8 border border-chetna-primary/10">
            <div className="flex items-center justify-center mb-8">
              <div className="h-16 w-16 rounded-full bg-chetna-primary/10 flex items-center justify-center mr-6">
                <Sparkles className="h-8 w-8 text-chetna-primary" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
                Our Mission
              </h2>
            </div>
            
            <p className="text-lg leading-relaxed mb-6 text-foreground/90 dark:text-foreground/90">
              At Chetna_Ai, we believe everyone deserves access to mental wellness support. Our mission is to leverage AI technology to make mental health resources more accessible, personalized, and stigma-free for people around the world.
            </p>
            
            <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground/90">
              Whether you're seeking a compassionate listener, tools to manage your emotions, or a community that understands, Chetna_Ai is designed to meet you where you are on your wellness journey and provide the support you need to thrive.
            </p>
          </div>
        </section>
        
        {/* How to Use Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
              How Chetna_Ai Works
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-foreground/80 dark:text-foreground/90">
              Our platform is designed to be intuitive and supportive at every step of your mental wellness journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="h-10 w-10 rounded-full bg-chetna-primary/10 flex items-center justify-center">
                  <span className="text-chetna-primary font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
                <p className="text-muted-foreground dark:text-foreground/70 mb-4">
                  Begin by chatting with our AI companion about how you're feeling or what's on your mind. Your conversations are private and judgment-free.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="h-10 w-10 rounded-full bg-chetna-primary/10 flex items-center justify-center">
                  <span className="text-chetna-primary font-bold">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track Your Journey</h3>
                <p className="text-muted-foreground dark:text-foreground/70 mb-4">
                  Use our journal feature to document your thoughts, feelings, and progress. Tracking helps identify patterns and celebrate improvements.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="h-10 w-10 rounded-full bg-chetna-primary/10 flex items-center justify-center">
                  <span className="text-chetna-primary font-bold">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect with Others</h3>
                <p className="text-muted-foreground dark:text-foreground/70 mb-4">
                  Join our community to share experiences, ask questions, and support others. Sometimes knowing you're not alone makes all the difference.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="h-10 w-10 rounded-full bg-chetna-primary/10 flex items-center justify-center">
                  <span className="text-chetna-primary font-bold">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Personalized Resources</h3>
                <p className="text-muted-foreground dark:text-foreground/70 mb-4">
                  Receive tailored suggestions, exercises, and resources based on your interactions and needs to support your mental wellness.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-foreground/80 dark:text-foreground/90">
              The passionate minds behind Chetna_Ai, committed to making mental wellness support accessible to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm border border-chetna-primary/10 hover:border-chetna-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/2] bg-chetna-primary/5 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-chetna-primary/10 flex items-center justify-center">
                      <User className="h-12 w-12 text-chetna-primary/40" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-chetna-primary mb-3">{member.role}</p>
                    <p className="text-muted-foreground dark:text-foreground/70">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Contact Section */}
        <section>
          <div className="bg-chetna-primary/5 dark:bg-chetna-primary/10 backdrop-blur-sm rounded-2xl p-8 border border-chetna-primary/10 text-center">
            <div className="flex items-center justify-center mb-6">
              <HeartHandshake className="h-7 w-7 text-chetna-primary mr-3" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
                Connect With Us
              </h2>
            </div>
            
            <p className="text-lg mb-8 max-w-2xl mx-auto text-foreground/80 dark:text-foreground/90">
              Have questions or feedback about Chetna_Ai? We'd love to hear from you! Reach out to our team.
            </p>
            
            <div className="inline-block">
              <a 
                href="mailto:contact@chetna-ai.com" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-chetna-primary to-chetna-primary/80 text-white font-medium hover:from-chetna-primary/90 hover:to-chetna-primary transition-all duration-300 shadow-sm"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-6 mt-8 bg-white/60 dark:bg-chetna-darker/60 backdrop-blur-sm border-t border-chetna-primary/10 dark:border-chetna-primary/20">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground dark:text-white/80">
            © {new Date().getFullYear()} Chetna_Ai - Your Mental Wellness Companion
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-sm text-muted-foreground dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
