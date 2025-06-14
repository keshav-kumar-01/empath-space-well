
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, Calendar, Video, Mail, Shield, Globe, Award } from 'lucide-react';

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
}

interface TherapistCardProps {
  therapist: Therapist;
  onBook: () => void;
  user: any;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onBook, user }) => {
  const generateJitsiLink = () => {
    const roomId = therapist.jitsi_room_id || `chetna-${therapist.id}-${Date.now()}`;
    return `https://meet.jit.si/${roomId}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="feature-card h-full flex flex-col hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <Avatar className="h-20 w-20 mx-auto border-4 border-white shadow-lg">
            <AvatarImage 
              src={therapist.photo_url || ''} 
              alt={therapist.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-r from-chetna-primary to-chetna-secondary text-white text-xl font-bold">
              {therapist.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {therapist.is_verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Shield className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{therapist.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="flex space-x-1">
            {renderStars(therapist.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {therapist.rating.toFixed(1)} ({therapist.total_reviews} reviews)
          </span>
        </div>

        {/* License Info */}
        {therapist.license_type && (
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-2">
            <Award className="h-4 w-4" />
            <span>{therapist.license_type}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Experience */}
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-chetna-primary">
            {therapist.experience_years} years experience
          </span>
        </div>

        {/* Bio */}
        {therapist.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {therapist.bio}
          </p>
        )}

        {/* Specializations */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Specializations:</h4>
          <div className="flex flex-wrap gap-1">
            {therapist.specializations.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {therapist.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{therapist.specializations.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Globe className="h-4 w-4 mr-1" />
            Languages:
          </h4>
          <div className="flex flex-wrap gap-1">
            {therapist.languages.map((lang, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          {/* Calendly Booking */}
          {therapist.calendly_link && (
            <Button
              onClick={() => window.open(therapist.calendly_link!, '_blank')}
              className="w-full bg-gradient-to-r from-chetna-primary to-chetna-secondary hover:opacity-90"
              size="sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          )}

          {/* Quick Book (Jitsi) */}
          <Button
            onClick={onBook}
            variant="outline"
            className="w-full border-chetna-primary text-chetna-primary hover:bg-chetna-primary hover:text-white"
            size="sm"
            disabled={!user}
          >
            <Video className="h-4 w-4 mr-2" />
            {user ? 'Quick Session' : 'Sign in to Book'}
          </Button>

          {/* Contact */}
          {therapist.contact_email && (
            <Button
              onClick={() => window.open(`mailto:${therapist.contact_email}`, '_blank')}
              variant="ghost"
              className="w-full text-gray-600 hover:text-chetna-primary"
              size="sm"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistCard;
