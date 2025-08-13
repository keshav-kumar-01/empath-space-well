
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { canAccessAdminFeatures } from '@/utils/adminSetup';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface AdminProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children, fallback }) => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      try {
        const hasAdminAccess = await canAccessAdminFeatures();
        setIsAdmin(hasAdminAccess);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (isLoading || checking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Please log in to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return fallback || (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. Admin access required.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default AdminProtected;
