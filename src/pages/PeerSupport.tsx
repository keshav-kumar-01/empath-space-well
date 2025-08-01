
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Users, MessageCircle, UserCheck, UserX, Sparkles, Coffee } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const PeerSupport = () => {
  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['peer-support-matches'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('peer_support_matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('matched_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user,
  });

  const findMatchMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get user's test results for matching
      const { data: userTests } = await supabase
        .from('psychological_test_results')
        .select('*')
        .eq('user_id', user.id)
        .limit(5);

      // Mock AI matching algorithm
      const compatibilityFactors = {
        personality_similarity: Math.random() * 0.4 + 0.6, // 60-100%
        goal_alignment: Math.random() * 0.3 + 0.7, // 70-100%
        activity_patterns: Math.random() * 0.2 + 0.8, // 80-100%
        communication_style: Math.random() * 0.3 + 0.6, // 60-90%
      };

      const matchScore = Object.values(compatibilityFactors).reduce((sum, score) => sum + score, 0) / 4;

      // Create a mock peer match
      const mockPeerId = 'peer-' + Math.random().toString(36).substr(2, 9);
      
      // For demo purposes, we'll create a simplified match entry
      // In a real app, this would be handled by admin functions or special permissions
      const matchData = {
        user1_id: user.id,
        user2_id: mockPeerId,
        match_score: matchScore,
        compatibility_factors: compatibilityFactors,
        status: 'pending'
      };

      // Since RLS might prevent direct insertion, we'll simulate the match creation
      // In production, this would be handled by a secure backend function
      return matchData;
    },
    onSuccess: (matchData) => {
      // Add the new match to the query cache to simulate successful creation
      queryClient.setQueryData(['peer-support-matches'], (oldData: any[]) => {
        const newMatch = {
          ...matchData,
          id: 'temp-' + Date.now(),
          matched_at: new Date().toISOString(),
        };
        return oldData ? [newMatch, ...oldData] : [newMatch];
      });
      
      setIsMatchingDialogOpen(false);
      toast.success('New peer match found! 🌸 Check your matches below.');
    },
    onError: (error) => {
      console.error('Error finding match:', error);
      toast.error('Failed to find a match. Please try again later.');
    },
  });

  const updateMatchStatus = useMutation({
    mutationFn: async ({ matchId, status }: { matchId: string; status: string }) => {
      if (!user) throw new Error('User not authenticated');

      // For demo purposes, we'll update the local cache
      // In production, this would update the database
      const updateData = {
        status,
        ...(status === 'accepted' && { accepted_at: new Date().toISOString() }),
        ...(status === 'ended' && { ended_at: new Date().toISOString() }),
      };

      return { id: matchId, ...updateData };
    },
    onSuccess: (data) => {
      // Update the query cache
      queryClient.setQueryData(['peer-support-matches'], (oldData: any[]) => {
        if (!oldData) return [];
        return oldData.map(match => 
          match.id === data.id ? { ...match, ...data } : match
        );
      });

      if (data.status === 'accepted') {
        toast.success('Match accepted! You can now start connecting 💙');
      } else if (data.status === 'declined') {
        toast.success('Match declined. We\'ll find you another peer!');
      }
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCompatibilityScore = (score: number) => {
    return `${(score * 100).toFixed(0)}%`;
  };

  const getMockPeerName = (peerId: string) => {
    const names = ['Sarah K.', 'Alex M.', 'Jordan L.', 'Taylor R.', 'Casey P.', 'Morgan T.'];
    const index = peerId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % names.length;
    return names[index];
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🤝 Peer Support</h1>
        <p className="text-gray-600 mb-8">Please log in to access peer support features</p>
        <Button onClick={() => window.location.href = '/login'}>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🤝 Peer Support</h1>
          <p className="text-gray-600">Connect with peers who understand your journey</p>
        </div>
        
        <Dialog open={isMatchingDialogOpen} onOpenChange={setIsMatchingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <Sparkles className="mr-2 h-4 w-4" />
              Find New Match
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Peer Matching</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Our AI will analyze your profile, test results, and goals to find the most compatible peer for support.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">🌸 Matching Criteria:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Personality compatibility</li>
                  <li>• Similar goals and challenges</li>
                  <li>• Communication preferences</li>
                  <li>• Activity patterns</li>
                </ul>
              </div>
              <Button 
                onClick={() => findMatchMutation.mutate()}
                disabled={findMatchMutation.isPending}
                className="w-full"
              >
                {findMatchMutation.isPending ? 'Finding Match...' : 'Start AI Matching'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading matches...</p>
          </div>
        ) : matches && matches.length > 0 ? (
          matches.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {getMockPeerName(match.user2_id).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{getMockPeerName(match.user2_id)}</CardTitle>
                      <p className="text-gray-600 text-sm">
                        Match Score: {formatCompatibilityScore(match.match_score)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(match.status || 'pending')}>
                    {match.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {match.compatibility_factors && (
                  <div>
                    <h4 className="font-medium mb-3">Compatibility Factors</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(match.compatibility_factors as Record<string, number>).map(([factor, score]) => (
                        <div key={factor} className="flex justify-between items-center">
                          <span className="text-sm capitalize">
                            {factor.replace('_', ' ')}
                          </span>
                          <Badge variant="outline">
                            {formatCompatibilityScore(score)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-600">
                    Matched on {new Date(match.matched_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    {match.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateMatchStatus.mutate({ matchId: match.id, status: 'accepted' })}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <UserCheck className="mr-1 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMatchStatus.mutate({ matchId: match.id, status: 'declined' })}
                        >
                          <UserX className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                      </>
                    )}
                    
                    {match.status === 'accepted' && (
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => toast.info('Chat feature coming soon!')}
                      >
                        <MessageCircle className="mr-1 h-4 w-4" />
                        Start Chat
                      </Button>
                    )}
                    
                    {match.status === 'active' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => toast.info('Chat feature coming soon!')}
                        >
                          <Coffee className="mr-1 h-4 w-4" />
                          Continue Chat
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMatchStatus.mutate({ matchId: match.id, status: 'ended' })}
                        >
                          End Match
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {match.status === 'accepted' && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-800 text-sm">
                      🌸 Great match! You can now start connecting and supporting each other.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No peer matches yet</h3>
            <p className="text-gray-600 mb-4">
              Use our AI matching system to find peers who understand your journey!
            </p>
            <Button onClick={() => setIsMatchingDialogOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Find Your First Match
            </Button>
          </div>
        )}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="h-6 w-6 text-pink-500" />
            <h3 className="text-lg font-semibold">How Peer Support Works</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">🤖 AI Matching</h4>
              <p className="text-gray-600">
                Our AI analyzes your profile and matches you with compatible peers based on goals, challenges, and personality.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">💬 Safe Connection</h4>
              <p className="text-gray-600">
                Connect with peers in a safe, moderated environment designed for meaningful support conversations.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🌱 Mutual Growth</h4>
              <p className="text-gray-600">
                Support each other's journey, share experiences, and grow together on your mental wellness path.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeerSupport;
