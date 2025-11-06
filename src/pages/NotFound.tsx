import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Track 404 for analytics if needed
    document.title = "404 - Page Not Found | Chetna_AI";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <Helmet>
        <title>404 - Page Not Found | Chetna AI</title>
        <meta name="description" content="The page you're looking for cannot be found." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <Card className="max-w-2xl mx-4 shadow-lg">
        <CardContent className="pt-12 pb-8 px-8 text-center">
          <div className="mb-8">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg mb-2">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-sm text-muted-foreground">
              Path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button size="lg" className="gap-2 min-h-[44px]">
                <Home className="h-5 w-5" aria-hidden="true" />
                Go Home
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" size="lg" className="gap-2 min-h-[44px]">
                <Search className="h-5 w-5" aria-hidden="true" />
                Browse Resources
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="lg" 
              onClick={() => window.history.back()}
              className="gap-2 min-h-[44px]"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Go Back
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? <Link to="/contact" className="text-primary hover:underline">Contact us</Link> or visit our <Link to="/resources" className="text-primary hover:underline">Resource Library</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
