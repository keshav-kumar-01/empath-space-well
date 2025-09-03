import React, { useState } from 'react';
import { useTherapistAuth } from '@/context/TherapistAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';
import TherapistImageUpload from './TherapistImageUpload';

interface TherapistProfileEditProps {
  therapist: any;
  onClose: () => void;
}

const TherapistProfileEdit: React.FC<TherapistProfileEditProps> = ({ 
  therapist, 
  onClose 
}) => {
  const { updateTherapistProfile } = useTherapistAuth();
  const [formData, setFormData] = useState({
    name: therapist.name || '',
    bio: therapist.bio || '',
    experience: therapist.experience || '',
    fee: therapist.fee || '',
    available: therapist.available || true,
    avatar_url: therapist.avatar_url || '',
    specialties: therapist.specialties || [],
    languages: therapist.languages || []
  });
  
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateTherapistProfile(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="e.g., 5 years"
              required
            />
          </div>

          <div>
            <Label htmlFor="fee">Fee</Label>
            <Input
              id="fee"
              value={formData.fee}
              onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
              placeholder="e.g., $100/session"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
            />
            <Label htmlFor="available">Available for appointments</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Profile Image</Label>
            <TherapistImageUpload
              value={formData.avatar_url}
              onChange={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell patients about yourself..."
          rows={4}
        />
      </div>

      <div>
        <Label>Specialties</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            placeholder="Add specialty"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
          />
          <Button type="button" onClick={addSpecialty} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
              {specialty}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSpecialty(specialty)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Languages</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="Add language"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
          />
          <Button type="button" onClick={addLanguage} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.languages.map((language) => (
            <Badge key={language} variant="secondary" className="flex items-center gap-1">
              {language}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeLanguage(language)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default TherapistProfileEdit;