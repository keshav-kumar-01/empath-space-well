
import React from "react";
import { Heart, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Header: React.FC = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    toast({
      title: darkMode ? "Light mode activated" : "Dark mode activated",
      duration: 1500,
    });
  };

  return (
    <header className="py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Heart className="w-6 h-6 text-chetna-primary" fill="#7C65E1" />
        <h1 className="text-xl font-bold">Chetna_Ai</h1>
      </div>
      
      <div className="flex items-center gap-2">
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
        
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full"
          onClick={() => {
            toast({
              title: "Menu coming soon",
              description: "Additional features will be available in future updates.",
              duration: 3000,
            });
          }}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
