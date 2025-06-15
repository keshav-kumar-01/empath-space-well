
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import "./App.css";
import "./lib/i18n";

const queryClient = new QueryClient();

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const MoodTracker = lazy(() => import("./pages/MoodTracker"));
const AppointmentBooking = lazy(() => import("./pages/AppointmentBooking"));
const ResourceLibrary = lazy(() => import("./pages/ResourceLibrary"));
const CrisisSupport = lazy(() => import("./pages/CrisisSupport"));
const Community = lazy(() => import("./pages/Community"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CreateBlogPost = lazy(() => import("./pages/CreateBlogPost"));
const EditBlogPost = lazy(() => import("./pages/EditBlogPost"));
const PersonalityQuiz = lazy(() => import("./pages/PersonalityQuiz"));
const PsychTests = lazy(() => import("./pages/PsychTests"));
const PsychTestRunner = lazy(() => import("./pages/PsychTestRunner"));
const TestResults = lazy(() => import("./pages/TestResults"));
const Feedback = lazy(() => import("./pages/Feedback"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Settings = lazy(() => import("./pages/Settings"));
const Journal = lazy(() => import("./pages/Journal"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-chetna-primary"></div></div>}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/mood-tracker" element={<MoodTracker />} />
                    <Route path="/appointments" element={<AppointmentBooking />} />
                    <Route path="/resources" element={<ResourceLibrary />} />
                    <Route path="/crisis-support" element={<CrisisSupport />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community/create" element={<CreatePost />} />
                    <Route path="/community/post/:id" element={<PostDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/blog/create" element={<CreateBlogPost />} />
                    <Route path="/blog/edit/:id" element={<EditBlogPost />} />
                    <Route path="/personality-quiz" element={<PersonalityQuiz />} />
                    <Route path="/psych-tests" element={<PsychTests />} />
                    <Route path="/psych-tests/:testType" element={<PsychTestRunner />} />
                    <Route path="/test-results" element={<TestResults />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Navigation />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
