
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, X, Sun, Moon, LogOut, LogIn, User, Heart } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const NavLink = ({ href, children, active = false }) => {
  return (
    <Link
      to={href}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
        active
          ? "bg-chetna-primary/10 text-chetna-primary"
          : "text-chetna-dark/80 dark:text-white/80 hover:text-chetna-primary hover:bg-chetna-primary/5"
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, children, onClick, active = false }) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`px-4 py-3 text-base font-medium rounded-xl block transition-all duration-300 ${
        active
          ? "bg-chetna-primary/10 text-chetna-primary"
          : "text-chetna-dark dark:text-white hover:text-chetna-primary hover:bg-chetna-primary/5"
      }`}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    await logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-chetna-darker/90 backdrop-blur-xl border-b border-chetna-primary/10 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-chetna-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <Heart className="w-4 h-4 text-chetna-primary" fill="currentColor" />
            </div>
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-accent bg-clip-text text-transparent">
              Chetna
              <span className="text-chetna-dark dark:text-white">_AI</span>
            </h2>
          </Link>
        </div>

        {isMobile ? (
          <>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-chetna-dark dark:text-white hover:bg-chetna-primary/10 rounded-full transition-all duration-300"
                    aria-label={t('header.menu')}
                  >
                    {showMobileMenu ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[350px] bg-white/95 dark:bg-chetna-darker/95 backdrop-blur-xl border-chetna-primary/20">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-chetna-primary text-xl font-semibold">{t('header.menu')}</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2">
                    <MobileNavLink
                      href="/"
                      onClick={() => setShowMobileMenu(false)}
                      active={isActive("/")}
                    >
                      {t('header.home')}
                    </MobileNavLink>
                    <MobileNavLink
                      href="/journal"
                      onClick={() => setShowMobileMenu(false)}
                      active={isActive("/journal")}
                    >
                      {t('header.journal')}
                    </MobileNavLink>
                    <MobileNavLink
                      href="/psych-tests"
                      onClick={() => setShowMobileMenu(false)}
                      active={isActive("/psych-tests")}
                    >
                      {t('header.psychTests')}
                    </MobileNavLink>
                    <MobileNavLink
                      href="/community"
                      onClick={() => setShowMobileMenu(false)}
                      active={isActive("/community")}
                    >
                      {t('header.community')}
                    </MobileNavLink>
                    <MobileNavLink
                      href="/blog"
                      onClick={() => setShowMobileMenu(false)}
                      active={isActive("/blog")}
                    >
                      {t('header.blog')}
                    </MobileNavLink>
                    <MobileNavLink
                      href="/feedback"
                      onClick={() => setShowMobileMenu(false)}
                      active={isActive("/feedback")}
                    >
                      {t('header.feedback')}
                    </MobileNavLink>
                    <MobileNavLink
                      href="/about"
                      onClick={() => setShowMobileMenu(false)}
                      active={isActive("/about")}
                    >
                      {t('header.about')}
                    </MobileNavLink>
                    
                    <div className="border-t border-chetna-primary/20 my-4 pt-4">
                      {user ? (
                        <>
                          <MobileNavLink
                            href="/profile"
                            onClick={() => setShowMobileMenu(false)}
                            active={isActive("/profile")}
                          >
                            <div className="flex items-center gap-2">
                              <User size={16} />
                              {t('header.profile')}
                            </div>
                          </MobileNavLink>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              handleSignOut();
                              setShowMobileMenu(false);
                            }}
                            className="w-full justify-start px-4 py-3 h-auto font-medium hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-300"
                          >
                            <LogOut size={16} className="mr-2" />
                            {t('header.signOut')}
                          </Button>
                        </>
                      ) : (
                        <MobileNavLink
                          href="/login"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <div className="flex items-center gap-2">
                            <LogIn size={16} />
                            {t('header.signIn')}
                          </div>
                        </MobileNavLink>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          toggleTheme();
                          setShowMobileMenu(false);
                        }}
                        className="w-full justify-start px-4 py-3 h-auto font-medium mt-2 hover:bg-chetna-primary/10 rounded-xl transition-all duration-300"
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun size={16} className="mr-2" />
                            {t('header.lightMode')}
                          </>
                        ) : (
                          <>
                            <Moon size={16} className="mr-2" />
                            {t('header.darkMode')}
                          </>
                        )}
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavLink href="/" active={isActive("/")}>
                  {t('header.home')}
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/journal" active={isActive("/journal")}>
                  {t('header.journal')}
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/psych-tests" active={isActive("/psych-tests")}>
                  {t('header.psychTests')}
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/community" active={isActive("/community")}>
                  {t('header.community')}
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/blog" active={isActive("/blog")}>
                  {t('header.blog')}
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/feedback" active={isActive("/feedback")}>
                  {t('header.feedback')}
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/about" active={isActive("/about")}>
                  {t('header.about')}
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="text-chetna-dark dark:text-white hover:bg-chetna-primary/10 rounded-full transition-all duration-300"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-chetna-dark dark:text-white hover:bg-chetna-primary/10 rounded-full transition-all duration-300"
                >
                  <User size={16} />
                  {t('header.profile')}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-chetna-dark dark:text-white hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all duration-300"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                {t('header.signOut')}
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-chetna-primary/30 bg-white/50 dark:bg-chetna-darker/50 text-chetna-dark dark:text-white hover:bg-chetna-primary/10 rounded-full transition-all duration-300"
              >
                <LogIn size={16} />
                {t('header.signIn')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
