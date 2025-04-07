
import React, { useState } from "react";
import { Heart, Moon, Sun, LogIn, User, Menu as MenuIcon, Book, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    toast({
      title: darkMode ? "Light mode activated" : "Dark mode activated",
      duration: 1500,
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
      duration: 3000,
    });
  };

  return (
    <header className="py-4 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Heart className="w-6 h-6 text-chetna-primary" fill="#7C65E1" />
        <h1 className="text-xl font-bold">Chetna_Ai</h1>
      </Link>
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:inline-block">
              Hi, {user.name}!
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/journal')}>
                  <Book className="h-4 w-4 mr-2" />
                  <span>Journal</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden md:flex"
            >
              Login
              <LogIn className="ml-1 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              size="sm"
              className="hidden md:flex"
            >
              Sign Up
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => navigate('/login')}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
