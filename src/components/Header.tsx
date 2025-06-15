
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, LogOut, User, BookOpen, Calendar, Stethoscope, Heart, MessageCircle, Shield, Brain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

interface MobileLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const MobileLink: React.FC<MobileLinkProps> = ({ to, onOpenChange, children, ...props }) => {
  return (
    <SheetClose asChild>
      <Link to={to} onClick={() => onOpenChange(false)} {...props}>
        {children}
      </Link>
    </SheetClose>
  );
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if user is admin (simplified approach for now)
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }
      
      // Check if the current user is you (the admin)
      if (user.id === '62529ac4-eaf2-4fa8-bca1-b6c0938478f1' || user.email === 'keshavkumarhf@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Heart className="h-6 w-6 text-chetna-primary fill-chetna-primary" />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-chetna-primary to-chetna-secondary bg-clip-text text-transparent">
              Chetna_AI
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/ai-features"
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
            >
              <Brain className="h-4 w-4" />
              AI Features
            </Link>
            <Link
              to="/profile"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Profile
            </Link>
            <Link
              to="/appointments"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Appointments
            </Link>
            <Link
              to="/community"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('nav.community')}
            </Link>
            <Link
              to="/blog"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('nav.blog')}
            </Link>
            <Link
              to="/psych-tests"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('nav.tests')}
            </Link>
            <Link
              to="/resources"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Resources
            </Link>
            <Link
              to="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('nav.about')}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink
              to="/"
              className="flex items-center space-x-2"
              onOpenChange={() => {}}
            >
              <Heart className="h-6 w-6 text-chetna-primary fill-chetna-primary" />
              <span className="font-bold">Chetna_AI</span>
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <MobileLink to="/ai-features" onOpenChange={() => {}}>
                  <Brain className="h-4 w-4 inline mr-2" />
                  AI Features
                </MobileLink>
                <MobileLink to="/profile" onOpenChange={() => {}}>
                  Profile
                </MobileLink>
                <MobileLink to="/mood-tracker" onOpenChange={() => {}}>
                  Mood Tracker
                </MobileLink>
                <MobileLink to="/appointments" onOpenChange={() => {}}>
                  Appointments
                </MobileLink>
                <MobileLink to="/resources" onOpenChange={() => {}}>
                  Resources
                </MobileLink>
                <MobileLink to="/crisis-support" onOpenChange={() => {}}>
                  Crisis Support
                </MobileLink>
                <MobileLink to="/community" onOpenChange={() => {}}>
                  {t('nav.community')}
                </MobileLink>
                <MobileLink to="/blog" onOpenChange={() => {}}>
                  {t('nav.blog')}
                </MobileLink>
                <MobileLink to="/psych-tests" onOpenChange={() =>{}}>
                  {t('nav.tests')}
                </MobileLink>
                <MobileLink to="/feedback" onOpenChange={() => {}}>
                  {t('nav.feedback')}
                </MobileLink>
                <MobileLink to="/about" onOpenChange={() => {}}>
                  {t('nav.about')}
                </MobileLink>
                {isAdmin && (
                  <MobileLink to="/admin" onOpenChange={() => {}}>
                    <Shield className="h-4 w-4 inline mr-2" />
                    Admin Dashboard
                  </MobileLink>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <LanguageSelector />
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.email || ""} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <p className="text-xs text-muted-foreground">
                          Administrator
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <User className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mood-tracker">
                      <Heart className="mr-2 h-4 w-4" />
                      Mood Tracker
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/appointments">
                      <Calendar className="mr-2 h-4 w-4" />
                      Appointments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/crisis-support">
                      <Shield className="mr-2 h-4 w-4" />
                      Crisis Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/journal">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {t('nav.journal')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/feedback">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {t('nav.feedback')}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('auth.signIn')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">{t('auth.signUp')}</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
