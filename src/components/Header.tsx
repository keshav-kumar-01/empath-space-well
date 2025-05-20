
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
import { Menu, X, Sun, Moon, LogOut, LogIn, User } from "lucide-react";

const NavLink = ({ href, children, active = false }) => {
  return (
    <Link
      to={href}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? "bg-primary/10 text-primary dark:bg-chetna-primary/20"
          : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
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
      className={`px-4 py-3 text-base font-medium rounded-md block transition-colors ${
        active
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const { user, signOut } = useAuth();
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
    await signOut();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="site-header sticky top-0 z-40 w-full bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <h2 className="text-lg md:text-xl font-bold text-chetna-primary">
              Chetna
              <span className="text-gray-600 dark:text-gray-300">_AI</span>
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
                  className="md:hidden"
                  aria-label="Menu"
                >
                  {showMobileMenu ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[350px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
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
                  
                  <div className="border-t border-border/50 my-2 pt-2">
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
                          className="w-full justify-start px-4 py-3 h-auto font-medium"
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
                      className="w-full justify-start px-4 py-3 h-auto font-medium mt-2"
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
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
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

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                as={Link}
                to="/profile"
              >
                <User size={16} />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                Sign out
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              as={Link}
              to="/login"
            >
              <LogIn size={16} />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
