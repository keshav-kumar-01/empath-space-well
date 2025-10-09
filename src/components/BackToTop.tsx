import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 rounded-full shadow-lg transition-all duration-300 hover:scale-110 min-h-[48px] min-w-[48px]"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </Button>
      )}
    </>
  );
};

export default BackToTop;
