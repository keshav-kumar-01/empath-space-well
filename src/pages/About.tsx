
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, User, MessageSquare, HeartHandshake, Lightbulb, Shield, Brain, Clock, Users, Star, TrendingUp, BarChart3, DollarSign, Mail, Phone, Globe, Zap, Award, Target } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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

  const uniqueFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Powered by state-of-the-art Mistral AI for natural, empathetic conversations",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock support whenever you need someone to talk to",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "End-to-end encrypted conversations with absolute confidentiality",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar journeys in our supportive community",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      icon: Target,
      title: "Personalized Care",
      description: "Tailored responses and resources based on your unique needs",
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30"
    },
    {
      icon: Award,
      title: "Evidence-Based",
      description: "Grounded in proven psychological principles and therapeutic techniques",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30"
    }
  ];

  const investmentSlides = [
    {
      title: "Market Opportunity",
      content: "Mental health market is valued at $240B+ globally with 25% annual growth",
      icon: TrendingUp,
      stats: "1 in 4 people affected by mental health issues worldwide"
    },
    {
      title: "AI-Powered Solution",
      content: "Cutting-edge technology making mental health support accessible to millions",
      icon: Brain,
      stats: "Available 24/7 in multiple languages"
    },
    {
      title: "User Engagement",
      content: "High user retention with positive feedback and growing community",
      icon: Users,
      stats: "95% user satisfaction rate"
    },
    {
      title: "Scalable Platform",
      content: "Cloud-based infrastructure supporting unlimited concurrent users",
      icon: Zap,
      stats: "Can scale to millions of users instantly"
    },
    {
      title: "Revenue Potential",
      content: "Multiple monetization streams including premium features and partnerships",
      icon: DollarSign,
      stats: "Projected 300% growth in next 2 years"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Helmet>
        <title>About Us - Chetna AI</title>
        <meta name="description" content="Learn about Chetna AI - Your Mental Wellness Companion and the team behind it." />
        <link rel="canonical" href="https://chetna.live/about" />
      </Helmet>
      
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

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
              Why Choose Chetna_AI?
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-foreground/80 dark:text-foreground/90">
              Discover what makes our platform unique in the mental wellness space
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-chetna-primary to-chetna-accent mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {uniqueFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm border border-chetna-primary/10 hover:border-chetna-primary/30 transition-all duration-300 hover:shadow-lg group hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`h-16 w-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground dark:text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
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

        {/* Invest in Us Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
              Invest in the Future of Mental Wellness
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-foreground/80 dark:text-foreground/90">
              Join us in revolutionizing mental health support through innovative AI technology
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-chetna-primary to-chetna-accent mx-auto rounded-full mt-4"></div>
          </div>

          {/* Investment Slideshow */}
          <div className="max-w-4xl mx-auto mb-12">
            <Carousel className="w-full">
              <CarouselContent>
                {investmentSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-gradient-to-br from-chetna-primary/10 via-white to-chetna-accent/10 dark:from-chetna-primary/20 dark:via-chetna-darker dark:to-chetna-accent/20 border border-chetna-primary/20">
                      <CardContent className="p-12">
                        <div className="text-center">
                          <div className="h-20 w-20 rounded-full bg-chetna-primary/20 dark:bg-chetna-primary/30 flex items-center justify-center mx-auto mb-6">
                            <slide.icon className="h-10 w-10 text-chetna-primary" />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-chetna-primary">
                            {slide.title}
                          </h3>
                          <p className="text-lg mb-6 text-foreground/80 dark:text-foreground/90 leading-relaxed">
                            {slide.content}
                          </p>
                          <div className="bg-chetna-primary/10 dark:bg-chetna-primary/20 rounded-lg p-4">
                            <p className="text-chetna-primary font-semibold text-lg">
                              {slide.stats}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Investment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm border border-chetna-primary/10">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <BarChart3 className="h-8 w-8 text-chetna-primary mr-3" />
                  <h3 className="text-2xl font-bold text-chetna-primary">Platform Metrics</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-chetna-primary/5 rounded-lg">
                    <span className="font-medium">Active Users</span>
                    <span className="text-chetna-primary font-bold">20+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-chetna-primary/5 rounded-lg">
                    <span className="font-medium">Daily Conversations</span>
                    <span className="text-chetna-primary font-bold">100+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-chetna-primary/5 rounded-lg">
                    <span className="font-medium">User Satisfaction</span>
                    <span className="text-chetna-primary font-bold">95%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-chetna-primary/5 rounded-lg">
                    <span className="font-medium">Countries Serving</span>
                    <span className="text-chetna-primary font-bold">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm border border-chetna-primary/10">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-chetna-primary mr-3" />
                  <h3 className="text-2xl font-bold text-chetna-primary">Investment Focus</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-chetna-primary bg-chetna-primary/5 rounded-r">
                    <h4 className="font-semibold mb-2">AI Technology Enhancement</h4>
                    <p className="text-sm text-muted-foreground">Advancing our AI capabilities for better user experiences</p>
                  </div>
                  <div className="p-4 border-l-4 border-chetna-accent bg-chetna-accent/5 rounded-r">
                    <h4 className="font-semibold mb-2">Global Expansion</h4>
                    <p className="text-sm text-muted-foreground">Scaling our platform to reach more users worldwide</p>
                  </div>
                  <div className="p-4 border-l-4 border-chetna-secondary bg-chetna-secondary/5 rounded-r">
                    <h4 className="font-semibold mb-2">Feature Development</h4>
                    <p className="text-sm text-muted-foreground">Building innovative tools for mental wellness</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              Have questions, feedback, or interested in investing? We'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/60 dark:bg-chetna-darker/60 backdrop-blur-sm border border-chetna-primary/10">
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-chetna-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">keshavkumarhf@gmail.com</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 dark:bg-chetna-darker/60 backdrop-blur-sm border border-chetna-primary/10">
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 text-chetna-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Website</h3>
                  <p className="text-sm text-muted-foreground">chetna-ai.com</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 dark:bg-chetna-darker/60 backdrop-blur-sm border border-chetna-primary/10">
                <CardContent className="p-6 text-center">
                  <User className="h-8 w-8 text-chetna-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Founder</h3>
                  <p className="text-sm text-muted-foreground">Keshav Kumar</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="inline-block">
              <a 
                href="mailto:keshavkumarhf@gmail.com" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-chetna-primary to-chetna-primary/80 text-white font-medium hover:from-chetna-primary/90 hover:to-chetna-primary transition-all duration-300 shadow-sm"
              >
                Contact Us for Investment
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
