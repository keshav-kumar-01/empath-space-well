
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface Therapist {
  specializations: string[];
  languages: string[];
}

interface TherapistFiltersProps {
  therapists: Therapist[];
  selectedSpecialization: string;
  selectedLanguage: string;
  onSpecializationChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
}

const TherapistFilters: React.FC<TherapistFiltersProps> = ({
  therapists,
  selectedSpecialization,
  selectedLanguage,
  onSpecializationChange,
  onLanguageChange,
}) => {
  // Get unique specializations and languages
  const allSpecializations = Array.from(
    new Set(therapists.flatMap(t => t.specializations))
  ).sort();
  
  const allLanguages = Array.from(
    new Set(therapists.flatMap(t => t.languages))
  ).sort();

  return (
    <Card className="mb-8 feature-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-chetna-primary" />
          <span>Filter Therapists</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Specialization Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <Select value={selectedSpecialization} onValueChange={onSpecializationChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {allSpecializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {allLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistFilters;
