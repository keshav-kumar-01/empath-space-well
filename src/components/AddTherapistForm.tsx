
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

const therapistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  experience: z.string().min(1, 'Experience is required'),
  fee: z.string().min(1, 'Fee is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  avatar_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type TherapistFormData = z.infer<typeof therapistSchema>;

interface AddTherapistFormProps {
  onSuccess?: () => void;
}

const AddTherapistForm: React.FC<AddTherapistFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [sessionTypes, setSessionTypes] = useState<string[]>(['individual']);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const form = useForm<TherapistFormData>({
    resolver: zodResolver(therapistSchema),
    defaultValues: {
      name: '',
      experience: '',
      fee: '',
      bio: '',
      avatar_url: '',
    },
  });

  const createTherapistMutation = useMutation({
    mutationFn: async (data: TherapistFormData & {
      specialties: string[];
      languages: string[];
      session_types: string[];
    }) => {
      const { error } = await supabase
        .from('therapists')
        .insert([{
          name: data.name,
          experience: data.experience,
          fee: data.fee,
          bio: data.bio,
          avatar_url: data.avatar_url || null,
          specialties: data.specialties,
          languages: data.languages,
          session_types: data.session_types,
          available: true,
          rating: 4.5,
          total_reviews: 0
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
      toast({
        title: "Success! ✅",
        description: "Therapist has been added successfully",
      });
      form.reset();
      setSpecialties([]);
      setLanguages([]);
      setSessionTypes(['individual']);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to add therapist',
        variant: "destructive",
      });
    }
  });

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setLanguages(languages.filter(l => l !== language));
  };

  const toggleSessionType = (type: string) => {
    if (sessionTypes.includes(type)) {
      setSessionTypes(sessionTypes.filter(t => t !== type));
    } else {
      setSessionTypes([...sessionTypes, type]);
    }
  };

  const onSubmit = (data: TherapistFormData) => {
    if (specialties.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one specialty",
        variant: "destructive",
      });
      return;
    }

    if (languages.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one language",
        variant: "destructive",
      });
      return;
    }

    createTherapistMutation.mutate({
      ...data,
      specialties,
      languages,
      session_types: sessionTypes,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience *</FormLabel>
                <FormControl>
                  <Input placeholder="8+ years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee *</FormLabel>
                <FormControl>
                  <Input placeholder="₹1,500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/avatar.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of the therapist's background and approach..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Specialties *</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add specialty"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" onClick={addSpecialty} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {specialties.map((specialty) => (
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
            <label className="text-sm font-medium">Languages *</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
              />
              <Button type="button" onClick={addLanguage} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {languages.map((language) => (
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

          <div>
            <label className="text-sm font-medium">Session Types</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['individual', 'couples', 'group', 'consultation'].map((type) => (
                <Badge
                  key={type}
                  variant={sessionTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSessionType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createTherapistMutation.isPending}
        >
          {createTherapistMutation.isPending ? 'Adding Therapist...' : 'Add Therapist'}
        </Button>
      </form>
    </Form>
  );
};

export default AddTherapistForm;
