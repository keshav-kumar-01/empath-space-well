
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, MessageCircle, Phone, Video, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Psychologist {
  id: string;
  name: string;
  specializations: string[];
  bio: string;
  experience_years: number;
  qualifications: string[];
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  profile_image_url?: string;
  languages: string[];
  consultation_modes: string[];
}

const Psychologists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: psychologists, isLoading } = useQuery({
    queryKey: ["psychologists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("psychologists")
        .select("*")
        .eq("is_verified", true)
        .eq("is_available", true)
        .order("rating", { ascending: false });

      if (error) throw error;
      return data as Psychologist[];
    },
  });

  const filteredPsychologists = psychologists?.filter((psychologist) => {
    const matchesSearch = psychologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psychologist.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialization = selectedSpecialization === "all" ||
      psychologist.specializations.includes(selectedSpecialization);
    
    const matchesMode = selectedMode === "all" ||
      psychologist.consultation_modes.includes(selectedMode);

    return matchesSearch && matchesSpecialization && matchesMode;
  });

  const allSpecializations = Array.from(
    new Set(psychologists?.flatMap(p => p.specializations) || [])
  );

  const handleBookSession = (psychologistId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a session with a psychologist.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate(`/psychologists/${psychologistId}/book`);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "chat": return <MessageCircle className="h-4 w-4" />;
      case "audio": return <Phone className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chetna-peach/20 to-chetna-bubble/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading psychologists...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chetna-peach/20 to-chetna-bubble/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-chetna-primary mb-4">
            Talk to a Psychologist
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with certified mental health professionals for personalized support and guidance
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-chetna-primary" />
            <h2 className="text-lg font-semibold">Find Your Perfect Match</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Specialization</label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {allSpecializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Consultation Mode</label>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="audio">Audio Call</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Psychologist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPsychologists?.map((psychologist) => (
            <Card key={psychologist.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={psychologist.profile_image_url} alt={psychologist.name} />
                  <AvatarFallback className="bg-chetna-primary text-white text-lg">
                    {psychologist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{psychologist.name}</CardTitle>
                <CardDescription>
                  {psychologist.experience_years} years of experience
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{psychologist.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({psychologist.total_reviews} reviews)</span>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {psychologist.specializations.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {psychologist.specializations.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{psychologist.specializations.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Available Modes</h4>
                  <div className="flex gap-2">
                    {psychologist.consultation_modes.map((mode) => (
                      <div key={mode} className="flex items-center gap-1 text-sm text-gray-600">
                        {getModeIcon(mode)}
                        <span className="capitalize">{mode}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {psychologist.bio}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-chetna-primary" />
                  <span className="font-medium">${psychologist.hourly_rate}/hour</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleBookSession(psychologist.id)}
                  className="w-full bg-chetna-primary hover:bg-chetna-primary/90"
                >
                  Book Session
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredPsychologists?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No psychologists found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Psychologists;
