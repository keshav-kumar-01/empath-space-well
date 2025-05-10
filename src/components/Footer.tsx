
import React from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 bg-white/60 dark:bg-chetna-darker/60 backdrop-blur-sm border-t border-chetna-primary/10 dark:border-chetna-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left text-sm text-muted-foreground dark:text-white/80">
            © {currentYear} Chetna_Ai - Your Mental Wellness Companion
          </p>
          
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <a 
                href="https://www.instagram.com/chetna_ai?utm_source=qr&igsh=YzU4eThnZzMxMXMw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-colors"
              >
                <Instagram size={18} className="text-pink-500" />
                <span>chetna_ai</span>
              </a>
            </div>
            <Link to="/about" className="text-sm text-muted-foreground dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground dark:text-white/70 hover:text-chetna-primary dark:hover:text-chetna-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
