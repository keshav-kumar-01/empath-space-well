
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TherapistCard from '@/components/therapy/TherapistCard';
import TherapistFilters from '@/components/therapy/TherapistFilters';
import EmergencyResources from '@/components/therapy/EmergencyResources';
import SessionReviewModal from '@/components/therapy/SessionReviewModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Shield, Clock, Users } from 'lucide-react';

interface Therapist {
  id: string;
  name: string;
  photo_url: string | null;
  specializations: string[];
  languages: string[];
  experience_years: number;
  license_number: string | null;
  license_type: string | null;
  bio: string | null;
  calendly_link: string | null;
  jitsi_room_id: string | null;
  contact_email: string | null;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_available: boolean;
}

const Therapy: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    filterTherapists();
  }, [therapists, selectedSpecialization, selectedLanguage]);

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('is_verified', true)
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setTherapists(data || []);
    } catch (err) {
      console.error('Error fetching therapists:', err);
      setError('Failed to load therapists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterTherapists = () => {
    let filtered = therapists;

    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(therapist =>
        therapist.specializations.includes(selectedSpecialization)
      );
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(therapist =>
        therapist.languages.includes(selectedLanguage)
      );
    }

    setFilteredTherapists(filtered);
  };

  const handleBookSession = async (therapistId: string) => {
    if (!user) {
      alert('Please sign in to book a session');
      return;
    }

    // Generate unique Jitsi room ID for the session
    const roomId = `chetna-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const meetingLink = `https://meet.jit.si/${roomId}`;

    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user.id,
          therapist_id: therapistId,
          session_date: new Date().toISOString(),
          jitsi_room_id: roomId,
          meeting_link: meetingLink,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      alert(`Session booked! Meeting link: ${meetingLink}`);
    } catch (err) {
      console.error('Error booking session:', err);
      alert('Failed to book session. Please try again.');
    }
  };

  const handleSessionComplete = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowReviewModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chetna-light via-white to-chetna-peach">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chetna-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chetna-light via-white to-chetna-peach">
      <Helmet>
        <title>Therapy - Connect with Verified Psychologists | Chetna AI</title>
        <meta name="description" content="Connect with verified mental health professionals for personalized therapy sessions. Book appointments with licensed psychologists and therapists." />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-chetna-primary to-chetna-secondary p-4 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent mb-4">
            Professional Therapy Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with verified mental health professionals for personalized therapy sessions. 
            Your mental wellness journey starts here with trusted, licensed therapists.
          </p>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Shield className="h-5 w-5 text-chetna-primary" />
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5 text-chetna-primary" />
              <span>Flexible Scheduling</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Users className="h-5 w-5 text-chetna-primary" />
              <span>Confidential Sessions</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Emergency Resources Section */}
        <EmergencyResources />

        {/* Filters */}
        <TherapistFilters
          therapists={therapists}
          selectedSpecialization={selectedSpecialization}
          selectedLanguage={selectedLanguage}
          onSpecializationChange={setSelectedSpecialization}
          onLanguageChange={setSelectedLanguage}
        />

        {/* Therapists Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Therapists ({filteredTherapists.length})
          </h2>
          
          {filteredTherapists.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-600 text-lg">
                  No therapists found matching your criteria. Please try adjusting your filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapists.map((therapist) => (
                <TherapistCard
                  key={therapist.id}
                  therapist={therapist}
                  onBook={() => handleBookSession(therapist.id)}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <Card className="mb-12 feature-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-chetna-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Browse Therapists</h3>
                <p className="text-gray-600 text-sm">Explore verified mental health professionals and their specializations</p>
              </div>
              <div className="text-center">
                <div className="bg-chetna-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Schedule Session</h3>
                <p className="text-gray-600 text-sm">Book appointments through Calendly or contact therapists directly</p>
              </div>
              <div className="text-center">
                <div className="bg-chetna-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Join Session</h3>
                <p className="text-gray-600 text-sm">Connect via secure Jitsi Meet video calls for your therapy session</p>
              </div>
              <div className="text-center">
                <div className="bg-chetna-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold mb-2">Provide Feedback</h3>
                <p className="text-gray-600 text-sm">Share your experience to help improve our services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />

      {/* Session Review Modal */}
      {showReviewModal && selectedSessionId && (
        <SessionReviewModal
          sessionId={selectedSessionId}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedSessionId(null);
          }}
        />
      )}
    </div>
  );
};

export default Therapy;
