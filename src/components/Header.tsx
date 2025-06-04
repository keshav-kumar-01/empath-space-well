
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Brain, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LanguageSelector from "./LanguageSelector";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <Brain className="h-8 w-8 text-chetna-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-accent bg-clip-text text-transparent">
            Chetna_AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-chetna-primary transition-colors">
            {t('navigation.home')}
          </Link>
          <Link to="/blog" className="text-sm font-medium hover:text-chetna-primary transition-colors">
            {t('navigation.blog')}
          </Link>
          <Link to="/community" className="text-sm font-medium hover:text-chetna-primary transition-colors">
            {t('navigation.community')}
          </Link>
          <Link to="/journal" className="text-sm font-medium hover:text-chetna-primary transition-colors">
            {t('navigation.journal')}
          </Link>
          <Link to="/psych-tests" className="text-sm font-medium hover:text-chetna-primary transition-colors">
            {t('navigation.tests')}
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-chetna-primary transition-colors">
            {t('navigation.about')}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-chetna-primary text-white">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/profile">{t('navigation.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {t('navigation.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">{t('navigation.login')}</Link>
              </Button>
              <Button asChild size="sm" className="chetna-button">
                <Link to="/signup">{t('navigation.signup')}</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium hover:text-chetna-primary transition-colors"
              onClick={closeMenu}
            >
              {t('navigation.home')}
            </Link>
            <Link
              to="/blog"
              className="block px-3 py-2 text-base font-medium hover:text-chetna-primary transition-colors"
              onClick={closeMenu}
            >
              {t('navigation.blog')}
            </Link>
            <Link
              to="/community"
              className="block px-3 py-2 text-base font-medium hover:text-chetna-primary transition-colors"
              onClick={closeMenu}
            >
              {t('navigation.community')}
            </Link>
            <Link
              to="/journal"
              className="block px-3 py-2 text-base font-medium hover:text-chetna-primary transition-colors"
              onClick={closeMenu}
            >
              {t('navigation.journal')}
            </Link>
            <Link
              to="/psych-tests"
              className="block px-3 py-2 text-base font-medium hover:text-chetna-primary transition-colors"
              onClick={closeMenu}
            >
              {t('navigation.tests')}
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium hover:text-chetna-primary transition-colors"
              onClick={closeMenu}
            >
              {t('navigation.about')}
            </Link>
            
            <div className="border-t pt-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium hover:text-chetna-primary transition-colors"
                    onClick={closeMenu}
                  >
                    {t('navigation.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium hover:text-chetna-primary transition-colors"
                  >
                    {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <div className="space-y-2 px-3">
                  <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                    <Link to="/login" onClick={closeMenu}>{t('navigation.login')}</Link>
                  </Button>
                  <Button asChild size="sm" className="w-full chetna-button">
                    <Link to="/signup" onClick={closeMenu}>{t('navigation.signup')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
