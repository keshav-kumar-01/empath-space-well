import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Clock, AlertTriangle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SessionHeaderProps {
  roomName: string;
  therapyType: string;
  participantCount: number;
  isConnected: boolean;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  roomName,
  therapyType,
  participantCount,
  isConnected
}) => {
  const navigate = useNavigate();
  const [sessionTime, setSessionTime] = useState(0);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTherapyTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      anxiety: '🧘',
      depression: '💙',
      grief: '🕊️',
      addiction: '💪',
      general: '🌸',
    };
    return emojis[type] || '👥';
  };

  const handleEmergencyExit = () => {
    navigate('/crisis-support');
  };

  const handleLeave = () => {
    navigate('/group-therapy');
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeave}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Leave
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTherapyTypeEmoji(therapyType)}</span>
            <div>
              <h1 className="font-semibold text-foreground">{roomName}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                  {isConnected ? '🟢 Live' : '🔴 Connecting...'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Session Timer */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            <Clock className="h-4 w-4" />
            <span>{formatTime(sessionTime)}</span>
          </div>

          {/* Participant Count */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            <Users className="h-4 w-4" />
            <span>{participantCount}</span>
          </div>

          {/* Emergency Exit */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Emergency
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Need Immediate Support?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    If you're in crisis or need immediate help, please reach out to a professional.
                  </p>
                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                    <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Crisis Helplines (India)
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>iCALL: 9152987821</li>
                      <li>Vandrevala Foundation: 1860-2662-345</li>
                      <li>NIMHANS: 080-46110007</li>
                    </ul>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay in Session</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmergencyExit} className="bg-destructive hover:bg-destructive/90">
                  Go to Crisis Support
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
};

export default SessionHeader;
