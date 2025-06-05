
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Calendar, MessageCircle, Brain, Users, FileText, UserCheck, BookOpen, TestTube } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: t('auth.logoutSuccess'),
        description: t('auth.logoutSuccessDesc'),
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t('auth.logoutError'),
        description: t('auth.logoutErrorDesc'),
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { href: "/", label: t('nav.home'), icon: null },
    { href: "/psychologists", label: t('nav.psychologists'), icon: <UserCheck className="h-4 w-4" /> },
    { href: "/journal", label: t('nav.journal'), icon: <FileText className="h-4 w-4" /> },
    { href: "/community", label: t('nav.community'), icon: <Users className="h-4 w-4" /> },
    { href: "/blog", label: t('nav.blog'), icon: <BookOpen className="h-4 w-4" /> },
    { href: "/psych-tests", label: t('nav.psychTests'), icon: <TestTube className="h-4 w-4" /> },
    { href: "/quiz", label: t('nav.quiz'), icon: <Brain className="h-4 w-4" /> },
    { href: "/about", label: t('nav.about'), icon: null },
  ];

  const userMenuItems = user ? [
    { href: "/profile", label: t('nav.profile'), icon: <User className="h-4 w-4" /> },
    { href: "/my-sessions", label: t('nav.mySessions'), icon: <Calendar className="h-4 w-4" /> },
  ] : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-chetna-primary" />
          <span className="text-xl font-bold text-chetna-primary">Chetna_AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.slice(0, 6).map((item) => (
            <Link 
              key={item.href} 
              to={item.href} 
              className="text-sm font-medium text-gray-700 hover:text-chetna-primary transition-colors flex items-center gap-1"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth & Language */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          
          {isLoading ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-chetna-primary border-t-transparent" />
          ) : user ? (
            <div className="flex items-center space-x-2">
              {userMenuItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                {t('auth.logout')}
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">{t('auth.login')}</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">{t('auth.signup')}</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSelector />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    to={item.href} 
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-chetna-primary transition-colors p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                
                <div className="border-t pt-4">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <div className="w-8 h-8 animate-spin rounded-full border-2 border-chetna-primary border-t-transparent" />
                    </div>
                  ) : user ? (
                    <div className="space-y-2">
                      {userMenuItems.map((item) => (
                        <Link 
                          key={item.href}
                          to={item.href}
                          className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-chetna-primary transition-colors p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                      <Button 
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start flex items-center gap-2 text-lg font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('auth.logout')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full">
                          {t('auth.login')}
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">
                          {t('auth.signup')}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
