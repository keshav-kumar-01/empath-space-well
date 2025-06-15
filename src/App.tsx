
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from "@/components/Navigation";

// Lazy load all pages for better performance
const Index = React.lazy(() => import('@/pages/Index'));
const Login = React.lazy(() => import('@/pages/Login'));
const Signup = React.lazy(() => import('@/pages/Signup'));
const UserProfile = React.lazy(() => import('@/pages/UserProfile'));
const Journal = React.lazy(() => import('@/pages/Journal'));
const Community = React.lazy(() => import('@/pages/Community'));
const CreatePost = React.lazy(() => import('@/pages/CreatePost'));
const PostDetail = React.lazy(() => import('@/pages/PostDetail'));
const Blog = React.lazy(() => import('@/pages/Blog'));
const CreateBlogPost = React.lazy(() => import('@/pages/CreateBlogPost'));
const EditBlogPost = React.lazy(() => import('@/pages/EditBlogPost'));
const BlogPost = React.lazy(() => import('@/pages/BlogPost'));
const PersonalityQuiz = React.lazy(() => import('@/pages/PersonalityQuiz'));
const PsychTests = React.lazy(() => import('@/pages/PsychTests'));
const PsychTestRunner = React.lazy(() => import('@/pages/PsychTestRunner'));
const TestResults = React.lazy(() => import('@/pages/TestResults'));
const Feedback = React.lazy(() => import('@/pages/Feedback'));
const About = React.lazy(() => import('@/pages/About'));
const Privacy = React.lazy(() => import('@/pages/Privacy'));
const Terms = React.lazy(() => import('@/pages/Terms'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Settings = React.lazy(() => import("@/pages/Settings"));
const MoodTracker = React.lazy(() => import("@/pages/MoodTracker"));
const CrisisSupport = React.lazy(() => import("@/pages/CrisisSupport"));
const ResourceLibrary = React.lazy(() => import("@/pages/ResourceLibrary"));
const AppointmentBooking = React.lazy(() => import("@/pages/AppointmentBooking"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/mood-tracker" element={<MoodTracker />} />
                <Route path="/crisis-support" element={<CrisisSupport />} />
                <Route path="/resources" element={<ResourceLibrary />} />
                <Route path="/appointments" element={<AppointmentBooking />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/create" element={<CreatePost />} />
                <Route path="/community/post/:id" element={<PostDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/create" element={<CreateBlogPost />} />
                <Route path="/blog/edit/:id" element={<EditBlogPost />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/quiz" element={<PersonalityQuiz />} />
                <Route path="/psych-tests" element={<PsychTests />} />
                <Route path="/psych-tests/:testType" element={<PsychTestRunner />} />
                <Route path="/test-results/:resultId" element={<TestResults />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Navigation />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
