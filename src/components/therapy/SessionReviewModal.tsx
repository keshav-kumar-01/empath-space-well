
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SessionReviewModalProps {
  sessionId: string;
  onClose: () => void;
}

const SessionReviewModal: React.FC<SessionReviewModalProps> = ({ sessionId, onClose }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!user || rating === 0) return;

    setSubmitting(true);
    try {
      // First, get the session details to find the therapist
      const { data: session, error: sessionError } = await supabase
        .from('therapy_sessions')
        .select('therapist_id')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Submit the review
      const { error } = await supabase
        .from('session_reviews')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          therapist_id: session.therapist_id,
          rating,
          feedback: feedback.trim() || null,
          is_anonymous: isAnonymous
        });

      if (error) throw error;

      alert('Thank you for your feedback!');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => setRating(index + 1)}
        className="focus:outline-none"
      >
        <Star
          className={`h-8 w-8 transition-colors ${
            index < rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Session</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Rating */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">How was your therapy session?</p>
            <div className="flex justify-center space-x-1">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {rating} out of 5 stars
              </p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Feedback (Optional)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience to help us improve our services..."
              rows={4}
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Submit this review anonymously
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={submitting}
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmitReview}
              className="flex-1 bg-gradient-to-r from-chetna-primary to-chetna-secondary"
              disabled={rating === 0 || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionReviewModal;
