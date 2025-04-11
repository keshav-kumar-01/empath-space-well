
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";

const Header: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const routes = [
    { path: "/", label: "Home" },
    { path: "/community", label: "Community" },
    { path: "/journal", label: "Journal" },
    { path: "/feedback", label: "Feedback" },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const toggleTheme = () => {
    const currentTheme = resolvedTheme || theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    console.log(`Toggling theme from ${currentTheme} to ${newTheme}`);
    setTheme(newTheme);
  };
  
  return (
    <header className="site-header">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent hover:from-chetna-primary/70 hover:to-chetna-primary transition-all duration-300">
              Chetna<span className="text-chetna-accent">_Ai</span>
            </h1>
          </Link>
          
          <nav className="ml-10 hidden md:flex items-center space-x-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`font-medium hover:text-chetna-primary transition-colors ${
                  isActive(route.path) ? "text-chetna-primary" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-chetna-primary to-chetna-primary/70 text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dropdown-content">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              size="sm" 
              onClick={() => navigate("/login")} 
              className="rounded-full px-4 bg-gradient-to-r from-chetna-primary to-chetna-primary/80 hover:from-chetna-primary/80 hover:to-chetna-primary"
            >
              Login
            </Button>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white/95 backdrop-blur-md border-r border-chetna-primary/10">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-chetna-primary to-chetna-primary/70 bg-clip-text text-transparent">
                    Chetna<span className="text-chetna-accent">_Ai</span>
                  </h2>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`font-medium hover:text-chetna-primary transition-colors ${
                      isActive(route.path) ? "text-chetna-primary" : "text-muted-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                
                {user && (
                  <Link
                    to="/profile"
                    className={`font-medium hover:text-chetna-primary transition-colors ${
                      isActive("/profile") ? "text-chetna-primary" : "text-muted-foreground"
                    }`}
                  >
                    Profile
                  </Link>
                )}
                
                {user ? (
                  <Button variant="outline" onClick={handleLogout} className="rounded-xl">
                    Logout
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")} className="rounded-xl bg-gradient-to-r from-chetna-primary to-chetna-primary/80 hover:from-chetna-primary/80 hover:to-chetna-primary">
                    Login
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
