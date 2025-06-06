
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Calendar, Video, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BookingModal from "@/components/therapy/BookingModal";

const Therapy: React.FC = () => {
  const [selectedPsychologist, setSelectedPsychologist] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: psychologists, isLoading } = useQuery({
    queryKey: ['psychologists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychologists')
        .select('*')
        .eq('is_verified', true)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  const handleBookSession = (psychologist: any) => {
    setSelectedPsychologist(psychologist);
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">Loading therapists...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-lavender via-white to-chetna-mint">
      <Helmet>
        <title>Professional Therapy - Chetna_AI</title>
        <meta name="description" content="Connect with licensed psychologists and therapists for professional mental health support" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent">
              Professional Therapy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with licensed psychologists for personalized mental health support through video calls or text sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {psychologists?.map((psychologist) => (
              <Card key={psychologist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-chetna-primary to-chetna-secondary rounded-full flex items-center justify-center text-white font-semibold">
                      {psychologist.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{psychologist.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">
                          {psychologist.rating || 0} ({psychologist.total_reviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {psychologist.specialization?.slice(0, 3).map((spec: string) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {psychologist.bio}
                  </CardDescription>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {psychologist.experience_years} years experience
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      ${psychologist.hourly_rate}/hour
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleBookSession(psychologist)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {selectedPsychologist && (
        <BookingModal
          psychologist={selectedPsychologist}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedPsychologist(null);
          }}
        />
      )}
    </div>
  );
};

export default Therapy;
