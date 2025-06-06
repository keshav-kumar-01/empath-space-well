
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Crown, User } from 'lucide-react';
import { UserRole } from '@/hooks/useUserRole';

interface AdminBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

const AdminBadge: React.FC<AdminBadgeProps> = ({ role, size = 'sm' }) => {
  if (!role || role === 'user') return null;

  const getIcon = () => {
    switch (role) {
      case 'admin':
        return <Crown className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />;
      case 'moderator':
        return <Shield className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />;
      default:
        return <User className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />;
    }
  };

  const getVariant = () => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant()} className="flex items-center gap-1">
      {getIcon()}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
};

export default AdminBadge;
