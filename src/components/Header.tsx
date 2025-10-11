import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Menu, 
  LogOut, 
  User, 
  BookOpen, 
  Calendar, 
  Stethoscope, 
  Heart, 
  MessageCircle, 
  Shield, 
  Brain,
  ChevronDown,
  BookMarked,
  Users,
  TestTube,
  Sparkles,
  LifeBuoy,
  TrendingUp,
  DollarSign
} from "lucide-react";

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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTherapistAuth } from "@/context/TherapistAuthContext";
import { cn } from "@/lib/utils";

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
  const { isTherapist } = useTherapistAuth();
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile Hamburger - Left Side */}
        <div className="flex items-center lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-[44px] min-w-[44px]"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]" aria-label="Mobile navigation menu">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="h-6 w-6 text-[#8B5CF6] fill-[#8B5CF6]" aria-hidden="true" />
                <span className="font-bold text-lg bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">Chetna_AI</span>
              </div>
              
              <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
                <nav className="flex flex-col space-y-1" aria-label="Main navigation">
                  {/* Features Section */}
                  <Collapsible className="space-y-1">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent transition-colors">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        Features
                      </span>
                      <ChevronDown className="h-4 w-4 transition-transform" aria-hidden="true" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 space-y-1">
                      <MobileLink to="/ai-features" onOpenChange={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                        <Brain className="h-4 w-4" aria-hidden="true" />
                        AI Features
                      </MobileLink>
                      <MobileLink to="/mood-tracker" onOpenChange={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                        <Heart className="h-4 w-4" aria-hidden="true" />
                        Mood Tracker
                      </MobileLink>
                      <MobileLink to="/journal" onOpenChange={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        Journal
                      </MobileLink>
                      <MobileLink to="/psych-tests" onOpenChange={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                        <TestTube className="h-4 w-4" aria-hidden="true" />
                        Psychological Tests
                      </MobileLink>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Resources Section */}
                  <Collapsible className="space-y-1">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent transition-colors">
                      <span className="flex items-center gap-2">
                        <BookMarked className="h-4 w-4" aria-hidden="true" />
                        Resources
                      </span>
                      <ChevronDown className="h-4 w-4 transition-transform" aria-hidden="true" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 space-y-1">
                      <MobileLink to="/resources" onOpenChange={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                        <BookMarked className="h-4 w-4" aria-hidden="true" />
                        Resource Library
                      </MobileLink>
                      <MobileLink to="/blog" onOpenChange={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        Blog
                      </MobileLink>
                      <MobileLink to="/crisis-support" onOpenChange={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                        <LifeBuoy className="h-4 w-4" aria-hidden="true" />
                        Crisis Support
                      </MobileLink>
                      <MobileLink to="/about" onOpenChange={() => {}} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                        <Users className="h-4 w-4" aria-hidden="true" />
                        About Us
                      </MobileLink>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Main Links */}
                  <MobileLink to="/community" onOpenChange={() => {}} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    {t('nav.community')}
                  </MobileLink>

                  {user && (
                    <>
                      {isTherapist ? (
                        <MobileLink to="/therapist-dashboard" onOpenChange={() => {}} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent">
                          <Stethoscope className="h-4 w-4" aria-hidden="true" />
                          Dashboard
                        </MobileLink>
                      ) : (
                        <MobileLink to="/appointments" onOpenChange={() => {}} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                          Appointments
                        </MobileLink>
                      )}
                      <MobileLink to="/profile" onOpenChange={() => {}} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent">
                        <User className="h-4 w-4" aria-hidden="true" />
                        Profile
                      </MobileLink>
                    </>
                  )}

                  <MobileLink to="/pricing" onOpenChange={() => {}} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent">
                    <DollarSign className="h-4 w-4" aria-hidden="true" />
                    Pricing
                  </MobileLink>

                  <MobileLink to="/feedback" onOpenChange={() => {}} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {t('nav.feedback')}
                  </MobileLink>

                  {isAdmin && (
                    <MobileLink to="/admin" onOpenChange={() => {}} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent text-amber-600">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      Admin Dashboard
                    </MobileLink>
                  )}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:transform-none">
          <Link to="/" className="flex items-center gap-2 min-h-[44px]" aria-label="Chetna AI Home">
            <Heart className="h-7 w-7 text-[#8B5CF6] fill-[#8B5CF6]" aria-hidden="true" />
            <span className="font-bold text-lg bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              Chetna_AI
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Features Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 gap-1">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md hover:bg-primary/10 transition-colors"
                          to="/ai-features"
                        >
                          <Brain className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            AI Features
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore our AI-powered mental health tools and chatbot
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/mood-tracker" title="Mood Tracker" icon={Heart}>
                      Track your daily moods and emotions
                    </ListItem>
                    <ListItem href="/journal" title="Journal" icon={BookOpen}>
                      Write and reflect on your thoughts
                    </ListItem>
                    <ListItem href="/psych-tests" title="Psychological Tests" icon={TestTube}>
                      Take validated mental health assessments
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Resources Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 gap-1">
                  <BookMarked className="h-4 w-4" aria-hidden="true" />
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <ListItem href="/resources" title="Resource Library" icon={BookMarked}>
                      Articles, videos, and exercises
                    </ListItem>
                    <ListItem href="/blog" title="Blog" icon={MessageCircle}>
                      Latest insights and stories
                    </ListItem>
                    <ListItem href="/crisis-support" title="Crisis Support" icon={LifeBuoy}>
                      Get immediate help and support
                    </ListItem>
                    <ListItem href="/about" title="About Us" icon={Users}>
                      Learn about our mission
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Community Link */}
              <NavigationMenuItem>
                <Link to="/community">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "h-10 gap-1")}>
                    <Users className="h-4 w-4" aria-hidden="true" />
                    {t('nav.community')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Dashboard/Appointments Link */}
              {user && (
                <NavigationMenuItem>
                  {isTherapist ? (
                    <Link to="/therapist-dashboard">
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "h-10 gap-1")}>
                        <Stethoscope className="h-4 w-4" aria-hidden="true" />
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  ) : (
                    <Link to="/appointments">
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "h-10 gap-1")}>
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        Appointments
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              )}

              {/* Pricing Link */}
              <NavigationMenuItem>
                <Link to="/pricing">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "h-10 gap-1")}>
                    <DollarSign className="h-4 w-4" aria-hidden="true" />
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Admin Link - only for admins */}
              {isAdmin && (
                <NavigationMenuItem>
                  <Link to="/admin">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "h-10 gap-1 text-amber-600 hover:text-amber-700")}>
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      Admin
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>


        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative rounded-full min-h-[44px] min-w-[44px]"
                  aria-label="Open user menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={user.email || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-background" align="end" forceMount>
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
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('nav.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/mood-tracker" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
                    Mood Tracker
                  </Link>
                </DropdownMenuItem>
                {isTherapist ? (
                  <DropdownMenuItem asChild>
                    <Link to="/therapist-dashboard" className="cursor-pointer">
                      <Stethoscope className="mr-2 h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/appointments" className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                      Appointments
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/journal" className="cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('nav.journal')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/crisis-support" className="cursor-pointer">
                    <LifeBuoy className="mr-2 h-4 w-4" aria-hidden="true" />
                    Crisis Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/feedback" className="cursor-pointer">
                    <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('nav.feedback')}
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer text-amber-600 focus:text-amber-700">
                        <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link to="/login">{t('auth.signIn')}</Link>
              </Button>
              <Button asChild size="default">
                <Link to="/signup">{t('auth.signUp')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Helper component for navigation menu items
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType; title: string; href: string }
>(({ className, title, children, icon: Icon, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-primary" aria-hidden="true" />}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
