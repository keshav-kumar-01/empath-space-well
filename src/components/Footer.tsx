
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Brain, Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-chetna-darker via-chetna-dark to-chetna-darker text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-chetna-primary rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-chetna-accent rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-chetna-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-accent bg-clip-text text-transparent">
                Chetna_AI
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Your compassionate AI companion for mental wellness. Experience personalized support, join our community, and take the first step towards better mental health.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Heart className="h-4 w-4 text-chetna-primary" />
              <span>Made with care for mental wellness</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-chetna-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-chetna-primary transition-colors">
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-chetna-primary transition-colors">
                  {t('navigation.blog')}
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-300 hover:text-chetna-primary transition-colors">
                  {t('navigation.community')}
                </Link>
              </li>
              <li>
                <Link to="/journal" className="text-gray-300 hover:text-chetna-primary transition-colors">
                  {t('navigation.journal')}
                </Link>
              </li>
              <li>
                <Link to="/psych-tests" className="text-gray-300 hover:text-chetna-primary transition-colors">
                  {t('navigation.tests')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-chetna-accent">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-chetna-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-chetna-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-chetna-primary transition-colors">
                  Feedback
                </Link>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@chetna-ai.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <div className="flex space-x-6 text-sm">
              <span className="text-gray-400">
                🇮🇳 Made in India with ❤️
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
