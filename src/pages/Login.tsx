import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Mail, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await login(email, password);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "Please check your credentials and try again"
        });
        setIsSubmitting(false);
        return;
      }
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    loginWithGoogle()
      .finally(() => {
        // Google login will redirect, but set isSubmitting to false just in case
        setTimeout(() => {
          setIsSubmitting(false);
        }, 3000);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-chetna-light to-white dark:from-chetna-dark dark:to-chetna-dark/80">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-card p-8 rounded-xl shadow-lg animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">{t('auth.welcomeBack')}</h1>
            <p className="text-muted-foreground mt-2">{t('auth.signInToContinue')}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Link to="/forgot-password" className="text-xs text-chetna-primary hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : t('auth.signIn')}
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full"
            disabled={isSubmitting}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            {t('auth.signInWithGoogle')}
          </Button>
          
          <p className="text-center mt-8 text-sm text-muted-foreground">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/signup" className="text-chetna-primary hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
