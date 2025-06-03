
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      text: "A really good chatbot. I feel better a small talk and the features like journal writing and blogs posting are mind blowing. Overall it's a really good experience with your service.",
      author: "Kaushalesh",
      rating: 5
    },
    {
      id: 2,
      text: "Chetna AI is a comforting and supportive tool. It listens without judgment, offers helpful coping strategies, and makes me feel heard. I appreciate the 24/7 availability and the gentle tone it uses. It's a great companion during tough moments. Really appreciate it.❤️",
      author: "Sakshi",
      rating: 5
    },
    {
      id: 3,
      text: "The Chetna_AI mental health service was easy to use, convenient, and supportive. I appreciated the secure, private environment and the helpful features like mood tracking, guided meditations, and wellness content. The clean, user-friendly interface made it comfortable to navigate.",
      author: "Ambika",
      rating: 5
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-chetna-primary via-chetna-accent to-chetna-primary bg-clip-text text-transparent mb-4">
            What Our Users Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-chetna-primary to-chetna-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="feature-card group hover:scale-105 transition-all duration-500 border-chetna-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Quote className="h-8 w-8 text-chetna-primary/60" />
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-muted-foreground dark:text-white/80 mb-6 leading-relaxed text-sm">
                  "{review.text}"
                </p>
                
                <div className="border-t border-chetna-primary/20 pt-4">
                  <p className="text-chetna-primary font-semibold">— {review.author}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
