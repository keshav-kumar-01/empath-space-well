import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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

const NavLink = ({ href, children, active = false }) => {
  return (
    <Link
      to={href}
      className={`px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-chetna-primary/20 to-chetna-accent/20 text-chetna-primary shadow-soft backdrop-blur-sm"
          : "text-chetna-dark/80 dark:text-white/80 hover:text-chetna-primary hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 hover:backdrop-blur-sm hover:shadow-soft"
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
          ? "bg-gradient-to-r from-chetna-primary/15 to-chetna-accent/15 text-chetna-primary shadow-soft"
          : "text-chetna-dark dark:text-white hover:text-chetna-primary hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10"
      }`}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-white/85 via-chetna-lavender/30 to-white/85 dark:from-chetna-darker/85 dark:via-chetna-primary/10 dark:to-chetna-darker/85 backdrop-blur-xl border-b border-gradient-to-r from-chetna-primary/15 via-chetna-accent/10 to-chetna-primary/15 shadow-soft">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-chetna-primary/20 to-chetna-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-soft">
              <Heart className="w-4 h-4 text-chetna-primary" fill="currentColor" />
            </div>
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-chetna-primary via-chetna-accent to-chetna-primary bg-clip-text text-transparent">
              Chetna
              <span className="text-chetna-dark dark:text-white">_AI</span>
            </h2>
          </Link>
        </div>

        {isMobile ? (
          <>
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-chetna-dark dark:text-white hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 rounded-full transition-all duration-300"
                  aria-label="Menu"
                >
                  {showMobileMenu ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[350px] bg-gradient-to-br from-white/95 via-chetna-lavender/40 to-white/95 dark:from-chetna-darker/95 dark:via-chetna-primary/10 dark:to-chetna-darker/95 backdrop-blur-xl border-chetna-primary/20 shadow-glow">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-chetna-primary text-xl font-semibold">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  <MobileNavLink
                    href="/"
                    onClick={() => setShowMobileMenu(false)}
                    active={isActive("/")}
                  >
                    Home
                  </MobileNavLink>
                  <MobileNavLink
                    href="/journal"
                    onClick={() => setShowMobileMenu(false)}
                    active={isActive("/journal")}
                  >
                    Journal
                  </MobileNavLink>
                  <MobileNavLink
                    href="/psych-tests"
                    onClick={() => setShowMobileMenu(false)}
                    active={isActive("/psych-tests")}
                  >
                    Psych Tests
                  </MobileNavLink>
                  <MobileNavLink
                    href="/community"
                    onClick={() => setShowMobileMenu(false)}
                    active={isActive("/community")}
                  >
                    Community
                  </MobileNavLink>
                  <MobileNavLink
                    href="/blog"
                    onClick={() => setShowMobileMenu(false)}
                    active={isActive("/blog")}
                  >
                    Blog
                  </MobileNavLink>
                  <MobileNavLink
                    href="/feedback"
                    onClick={() => setShowMobileMenu(false)}
                    active={isActive("/feedback")}
                  >
                    Feedback
                  </MobileNavLink>
                  <MobileNavLink
                    href="/about"
                    onClick={() => setShowMobileMenu(false)}
                    active={isActive("/about")}
                  >
                    About
                  </MobileNavLink>
                  
                  <div className="border-t border-gradient-to-r from-chetna-primary/20 to-chetna-accent/20 my-4 pt-4">
                    {user ? (
                      <>
                        <MobileNavLink
                          href="/profile"
                          onClick={() => setShowMobileMenu(false)}
                          active={isActive("/profile")}
                        >
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            Profile
                          </div>
                        </MobileNavLink>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleSignOut();
                            setShowMobileMenu(false);
                          }}
                          className="w-full justify-start px-4 py-3 h-auto font-medium hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-400/10 hover:text-red-500 rounded-xl transition-all duration-300"
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign out
                        </Button>
                      </>
                    ) : (
                      <MobileNavLink
                        href="/login"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <div className="flex items-center gap-2">
                          <LogIn size={16} />
                          Sign In
                        </div>
                      </MobileNavLink>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        toggleTheme();
                        setShowMobileMenu(false);
                      }}
                      className="w-full justify-start px-4 py-3 h-auto font-medium mt-2 hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 rounded-xl transition-all duration-300"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun size={16} className="mr-2" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon size={16} className="mr-2" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="gap-1 px-6 py-2 bg-gradient-to-r from-white/40 via-chetna-lavender/30 to-white/40 dark:from-chetna-darker/40 dark:via-chetna-primary/15 dark:to-chetna-darker/40 backdrop-blur-xl rounded-full shadow-soft border border-white/30 dark:border-chetna-primary/20">
              <NavigationMenuItem>
                <NavLink href="/" active={isActive("/")}>
                  Home
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/journal" active={isActive("/journal")}>
                  Journal
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/psych-tests" active={isActive("/psych-tests")}>
                  Psych Tests
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/community" active={isActive("/community")}>
                  Community
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/blog" active={isActive("/blog")}>
                  Blog
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/feedback" active={isActive("/feedback")}>
                  Feedback
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/about" active={isActive("/about")}>
                  About
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="text-chetna-dark dark:text-white hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 rounded-full transition-all duration-300 shadow-soft"
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
                  className="gap-2 text-chetna-dark dark:text-white hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 rounded-full transition-all duration-300 shadow-soft"
                >
                  <User size={16} />
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-chetna-dark dark:text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-400/10 hover:text-red-500 rounded-full transition-all duration-300"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-2 border-chetna-primary/30 bg-gradient-to-r from-white/30 to-chetna-lavender/20 text-chetna-dark dark:text-white hover:bg-gradient-to-r hover:from-chetna-primary/10 hover:to-chetna-accent/10 rounded-full transition-all duration-300 shadow-soft backdrop-blur-sm"
              >
                <LogIn size={16} />
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
