import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, X, Sun, Moon, LogOut, LogIn, User } from "lucide-react";

const NavLink = ({ href, children, active }) => (
  <Link
    to={href}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
        : "text-foreground hover:text-primary hover:bg-muted/20"
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ href, children, onClick, active }) => (
  <Link
    to={href}
    onClick={onClick}
    className={`px-4 py-3 text-base font-medium rounded-md block transition-colors ${
      active
        ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
        : "text-foreground hover:text-primary hover:bg-muted/20"
    }`}
  >
    {children}
  </Link>
);

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  const getLabel = (path) =>
    path === "/" ? "Home" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2);

  return (
    <header className="site-header">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-accent bg-clip-text text-transparent">
              Chetna<span className="text-gray-800 dark:text-white">_AI</span>
            </h2>
          </Link>
        </div>

        {/* Mobile View */}
        {isMobile ? (
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-800 dark:text-white hover:bg-white/10"
                aria-label="Menu"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[350px] bg-white/95 dark:bg-chetna-darker/95 backdrop-blur-lg border-chetna-primary/20">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-chetna-primary">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {["/", "/journal", "/community", "/blog", "/feedback", "/about"].map((path) => (
                  <MobileNavLink
                    key={path}
                    href={path}
                    onClick={() => setShowMobileMenu(false)}
                    active={isActive(path)}
                  >
                    {getLabel(path)}
                  </MobileNavLink>
                ))}
                <div className="border-t border-chetna-primary/10 my-2 pt-2">
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
                        className="w-full justify-start px-4 py-3 h-auto font-medium hover:bg-red-500/10 hover:text-red-500"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <MobileNavLink href="/login" onClick={() => setShowMobileMenu(false)}>
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
                    className="w-full justify-start px-4 py-3 h-auto font-medium mt-2 hover:bg-primary/10"
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
        ) : null}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <ul className="flex gap-1 px-4 py-1 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-full shadow-sm">
            {["/", "/journal", "/community", "/blog", "/feedback", "/about"].map((path) => (
              <li key={path}>
                <NavLink href={path} active={isActive(path)}>
                  {getLabel(path)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Auth and Theme Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="text-gray-800 dark:text-white hover:bg-white/10"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2 text-gray-800 dark:text-white hover:bg-white/10">
                  <User size={16} />
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-800 dark:text-white hover:bg-white/10 hover:text-red-500"
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
                className="gap-2 border-chetna-primary/30 bg-white/20 text-gray-800 dark:text-white hover:bg-white/30"
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
