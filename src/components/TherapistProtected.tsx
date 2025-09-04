import React, { useState, useEffect } from 'react';
import { useTherapistAuth } from '@/context/TherapistAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface TherapistProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const TherapistProtected: React.FC<TherapistProtectedProps> = ({ children, fallback }) => {
  const { isTherapist, isLoading } = useTherapistAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isTherapist) {
    return fallback || (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. Therapist access required.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default TherapistProtected;