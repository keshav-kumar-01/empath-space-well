
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TherapistOnboarding: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    experience_years: 0,
    license_number: '',
    license_type: '',
    contact_email: '',
    calendly_link: '',
    jitsi_room_id: '',
    photo_url: ''
  });

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setSpecializations(specializations.filter(s => s !== spec));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.contact_email) {
        throw new Error('Name and email are required');
      }

      const { data, error } = await supabase
        .from('therapists')
        .insert({
          name: formData.name,
          bio: formData.bio,
          experience_years: formData.experience_years,
          license_number: formData.license_number,
          license_type: formData.license_type,
          contact_email: formData.contact_email,
          calendly_link: formData.calendly_link,
          jitsi_room_id: formData.jitsi_room_id,
          photo_url: formData.photo_url,
          specializations: specializations,
          languages: languages,
          is_verified: true, // Auto-verify for now
          is_available: true
        });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Success!",
        description: "Therapist has been successfully onboarded.",
      });

      // Reset form
      setFormData({
        name: '',
        bio: '',
        experience_years: 0,
        license_number: '',
        license_type: '',
        contact_email: '',
        calendly_link: '',
        jitsi_room_id: '',
        photo_url: ''
      });
      setSpecializations([]);
      setLanguages([]);

    } catch (err: any) {
      console.error('Error adding therapist:', err);
      setError(err.message || 'Failed to add therapist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-chetna-light via-white to-chetna-peach">
      <Helmet>
        <title>Therapist Onboarding | Chetna AI</title>
        <meta name="description" content="Add new therapists to the Chetna AI platform." />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-chetna-primary to-chetna-secondary p-4 rounded-full">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent mb-4">
              Therapist Onboarding
            </h1>
            <p className="text-gray-600 text-lg">
              Add new verified mental health professionals to the platform
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Therapist has been successfully added to the platform!
              </AlertDescription>
            </Alert>
          )}

          <Card className="feature-card">
            <CardHeader>
              <CardTitle>Add New Therapist</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Dr. Jane Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="jane.smith@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <Input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                      min="0"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Type
                    </label>
                    <Input
                      type="text"
                      value={formData.license_type}
                      onChange={(e) => handleInputChange('license_type', e.target.value)}
                      placeholder="Licensed Clinical Psychologist"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <Input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => handleInputChange('license_number', e.target.value)}
                    placeholder="PSY12345"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Brief description of background, approach, and expertise..."
                    rows={4}
                  />
                </div>

                {/* Photo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo URL
                  </label>
                  <Input
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => handleInputChange('photo_url', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {/* Specializations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      type="text"
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      placeholder="Add specialization (e.g., Anxiety, Depression)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                    />
                    <Button type="button" onClick={addSpecialization} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="flex items-center space-x-1">
                        <span>{spec}</span>
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeSpecialization(spec)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add language (e.g., English, Spanish)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                    />
                    <Button type="button" onClick={addLanguage} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="flex items-center space-x-1">
                        <span>{lang}</span>
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeLanguage(lang)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Booking and Session Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calendly Link
                    </label>
                    <Input
                      type="url"
                      value={formData.calendly_link}
                      onChange={(e) => handleInputChange('calendly_link', e.target.value)}
                      placeholder="https://calendly.com/therapist-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jitsi Room ID
                    </label>
                    <Input
                      type="text"
                      value={formData.jitsi_room_id}
                      onChange={(e) => handleInputChange('jitsi_room_id', e.target.value)}
                      placeholder="therapist-room-123"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-chetna-primary to-chetna-secondary"
                >
                  {loading ? 'Adding Therapist...' : 'Add Therapist'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TherapistOnboarding;
