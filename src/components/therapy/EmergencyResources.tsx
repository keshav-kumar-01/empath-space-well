
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Globe, MessageCircle, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmergencyResource {
  id: string;
  title: string;
  description: string;
  phone_number: string | null;
  website_url: string | null;
  country: string;
  resource_type: string; // Changed to string to match Supabase response
  is_24_7: boolean;
}

const EmergencyResources: React.FC = () => {
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyResources();
  }, []);

  const fetchEmergencyResources = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_resources')
        .select('*')
        .order('is_24_7', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching emergency resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'hotline':
        return <Phone className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      case 'text_service':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'hotline':
        return 'Hotline';
      case 'website':
        return 'Website';
      case 'text_service':
        return 'Text Service';
      case 'app':
        return 'App';
      default:
        return 'Resource';
    }
  };

  if (loading) {
    return (
      <Card className="mb-8 border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="animate-pulse">Loading emergency resources...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          <span>Emergency Mental Health Resources</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-red-300 bg-red-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <strong>If you're in crisis or having thoughts of self-harm, please reach out immediately.</strong>
            <br />
            These resources provide free, confidential support 24/7.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="border-red-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-red-800 flex items-center space-x-2">
                    {getResourceIcon(resource.resource_type)}
                    <span>{resource.title}</span>
                  </h3>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {getResourceTypeLabel(resource.resource_type)}
                    </Badge>
                    {resource.is_24_7 && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        24/7
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{resource.description}</p>
                
                <div className="flex space-x-2">
                  {resource.phone_number && (
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => window.open(`tel:${resource.phone_number}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call {resource.phone_number}
                    </Button>
                  )}
                  
                  {resource.website_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => window.open(resource.website_url!, '_blank')}
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>International Users:</strong> If you're outside the US, please search for local crisis resources 
            or contact your local emergency services.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyResources;
