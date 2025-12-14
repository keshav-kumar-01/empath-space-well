import React from "react";
import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter, Globe, Users, Sparkles, Code, TrendingUp, Megaphone } from "lucide-react";

const ContactTeam = () => {
  const founders = [
    {
      name: "Keshav Kumar",
      role: "Founder, CEO & CTO",
      description: "The visionary creator behind Chetna AI. Keshav single-handedly developed the entire platform with a passion for making mental health support accessible to everyone. With expertise in AI and technology, he leads the technical and strategic direction of Chetna.",
      icon: Code,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      email: "keshav@chetna.life",
      linkedin: "https://linkedin.com/in/keshavkumar",
      twitter: "https://twitter.com/keshavkumar"
    },
    {
      name: "Ashutosh Pratap Singh",
      role: "Co-Founder & Business Head",
      description: "Dedicated to growing Chetna's reach and ensuring our platform creates meaningful impact for all users. Ashutosh handles business development, partnerships, and strategic growth initiatives.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      email: "ashutosh@chetna.life",
      linkedin: "https://linkedin.com/in/ashutoshpratapsingh",
      twitter: "https://twitter.com/ashutoshpsingh"
    },
    {
      name: "Anchal Singh",
      role: "Co-Founder & CMO (Marketing Head)",
      description: "Focused on building awareness around mental wellness and ensuring Chetna reaches those who need it most. Anchal leads marketing, branding, and community engagement efforts.",
      icon: Megaphone,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      email: "anchal@chetna.life",
      linkedin: "https://linkedin.com/in/anchalsingh",
      twitter: "https://twitter.com/anchalsingh"
    }
  ];

  return (
    <PageLayout>
      <Helmet>
        <title>Contact Our Team - Chetna AI | Meet the Founders</title>
        <meta name="description" content="Meet the passionate team behind Chetna AI. Contact our founders - Keshav Kumar (CEO), Ashutosh Pratap Singh (Business Head), and Anchal Singh (CMO)." />
        <meta name="keywords" content="Chetna AI team, Keshav Kumar, Ashutosh Pratap Singh, Anchal Singh, mental health startup, contact Chetna" />
        <link rel="canonical" href="https://chetna.life/contact-team" />
      </Helmet>

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-chetna-primary/10 dark:bg-chetna-primary/20 rounded-full mb-6">
            <Users className="h-5 w-5 text-chetna-primary" />
            <span className="text-sm font-medium text-chetna-primary">Our Team</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-chetna-primary via-chetna-accent to-chetna-primary bg-clip-text text-transparent">
            Meet the Minds Behind Chetna AI
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80 dark:text-foreground/90 leading-relaxed">
            We're a passionate team dedicated to revolutionizing mental health support in India through innovative AI technology. Get in touch with us!
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-chetna-primary to-chetna-accent mx-auto rounded-full mt-6"></div>
        </section>

        {/* Founders Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {founders.map((founder, index) => (
            <Card 
              key={index} 
              className="bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm border border-chetna-primary/10 hover:border-chetna-primary/30 transition-all duration-500 hover:shadow-xl group hover:-translate-y-2"
            >
              <CardContent className="p-8">
                {/* Icon & Role Badge */}
                <div className="flex flex-col items-center text-center">
                  <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${founder.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <founder.icon className="h-12 w-12 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2 text-foreground">{founder.name}</h2>
                  
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${founder.bgColor} text-foreground`}>
                    {founder.role}
                  </span>
                  
                  <p className="text-muted-foreground dark:text-foreground/70 leading-relaxed mb-6">
                    {founder.description}
                  </p>
                  
                  {/* Contact Options */}
                  <div className="w-full space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 hover:bg-chetna-primary/10 hover:border-chetna-primary transition-all"
                      onClick={() => window.location.href = `mailto:${founder.email}`}
                    >
                      <Mail className="h-4 w-4" />
                      {founder.email}
                    </Button>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="flex-1 hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-500 transition-all"
                        onClick={() => window.open(founder.linkedin, '_blank')}
                      >
                        <Linkedin className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="flex-1 hover:bg-sky-500/10 hover:border-sky-500 hover:text-sky-500 transition-all"
                        onClick={() => window.open(founder.twitter, '_blank')}
                      >
                        <Twitter className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* General Contact Section */}
        <section className="bg-gradient-to-br from-chetna-primary/10 via-white to-chetna-accent/10 dark:from-chetna-primary/20 dark:via-chetna-darker dark:to-chetna-accent/20 rounded-3xl p-8 md:p-12 border border-chetna-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-chetna-primary/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-chetna-primary" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Let's Build Something Amazing Together
            </h2>
            
            <p className="text-muted-foreground dark:text-foreground/80 mb-8 leading-relaxed">
              Whether you're interested in partnerships, investments, media inquiries, or just want to say hello — we'd love to hear from you!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-chetna-primary to-chetna-accent hover:opacity-90 text-white gap-2"
                onClick={() => window.location.href = 'mailto:hello@chetna.life'}
              >
                <Mail className="h-4 w-4" />
                hello@chetna.life
              </Button>
              
              <Button 
                variant="outline"
                className="gap-2 hover:bg-chetna-primary/10"
                onClick={() => window.open('https://chetna.life', '_blank')}
              >
                <Globe className="h-4 w-4" />
                Visit Our Website
              </Button>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default ContactTeam;
