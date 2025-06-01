import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Helmet } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Journal from "./pages/Journal";
import Feedback from "./pages/Feedback";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PersonalityQuiz from "./pages/PersonalityQuiz";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CreateBlogPost from "./pages/CreateBlogPost";
import EditBlogPost from "./pages/EditBlogPost";
import PsychTests from "./pages/PsychTests";
import PsychTestRunner from "./pages/PsychTestRunner";
import TestResults from "./pages/TestResults";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/post/:id" element={<PostDetail />} />
              <Route path="/community/create" element={<CreatePost />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/quiz" element={<PersonalityQuiz />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/post/:id" element={<BlogPost />} />
              <Route path="/blog/create" element={<CreateBlogPost />} />
              <Route path="/blog/edit/:id" element={<EditBlogPost />} />
              <Route path="/psych-tests" element={<PsychTests />} />
              <Route path="/psych-tests/:testId" element={<PsychTestRunner />} />
              <Route path="/psych-tests/results" element={<TestResults />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
