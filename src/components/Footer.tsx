
import React from "react";
import { Link } from "react-router-dom";
import { Instagram, BrainCircuit, Heart } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 bg-gradient-to-r from-white/70 via-chetna-lavender/40 to-white/70 dark:from-chetna-darker/70 dark:via-chetna-primary/10 dark:to-chetna-darker/70 backdrop-blur-xl border-t border-gradient-to-r from-chetna-primary/20 via-chetna-accent/15 to-chetna-primary/20 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-chetna-primary/20 to-chetna-accent/20 rounded-full flex items-center justify-center shadow-soft">
              <Heart className="w-4 h-4 text-chetna-primary" fill="currentColor" />
            </div>
            <p className="text-center md:text-left text-sm text-chetna-dark/80 dark:text-white/80 font-medium">
              © {currentYear} Chetna_AI - Your Mental Wellness Companion
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <a 
                href="https://www.instagram.com/_chetna_ai_?utm_source=qr&igsh=YzU4eThnZzMxMXMw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-chetna-dark/70 dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-all duration-300 hover:scale-105 px-3 py-2 rounded-full hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 hover:shadow-soft"
              >
                <Instagram size={18} className="text-pink-500" />
                <span>_chetna_ai_</span>
              </a>
            </div>
            <Link 
              to="/quiz" 
              className="flex items-center gap-2 text-sm text-chetna-dark/70 dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-all duration-300 hover:scale-105 px-3 py-2 rounded-full hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 hover:shadow-soft"
            >
              <BrainCircuit size={18} className="text-chetna-primary" />
              <span>Chetna Quest</span>
            </Link>
            <Link 
              to="/about" 
              className="text-sm text-chetna-dark/70 dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-all duration-300 hover:scale-105 px-3 py-2 rounded-full hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 hover:shadow-soft"
            >
              About
            </Link>
            <Link 
              to="/privacy" 
              className="text-sm text-chetna-dark/70 dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-all duration-300 hover:scale-105 px-3 py-2 rounded-full hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 hover:shadow-soft"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-sm text-chetna-dark/70 dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-all duration-300 hover:scale-105 px-3 py-2 rounded-full hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 hover:shadow-soft"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
