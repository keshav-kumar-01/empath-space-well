
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const isAdmin = user?.email === 'keshavkumarhf@gmail.com';

  return (
    <header className="bg-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-chetna-primary">
          Chetna AI
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/journal"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{t('nav.journal')}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Write and track your thoughts and moods
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/therapy"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Therapy</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Connect with verified mental health professionals
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/psych-tests"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Psychological Tests</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Take validated psychological assessments
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/quiz"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{t('nav.quiz')}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Discover your personality type
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Community</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/community"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{t('nav.community')}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Connect with others on similar journeys
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/blog"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Blog</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Read articles and insights on mental health
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/therapist-onboarding"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Add Therapist</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Onboard new mental health professionals
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <Link to="/about" className={navigationMenuTriggerStyle()}>
                {t('nav.about')}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-chetna-primary">
                {t('nav.profile')}
              </Link>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                {t('nav.signOut')}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-chetna-primary">
                {t('nav.login')}
              </Link>
              <Link to="/signup" className="bg-chetna-primary text-white py-2 px-4 rounded hover:bg-chetna-secondary transition-colors">
                {t('nav.signUp')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
