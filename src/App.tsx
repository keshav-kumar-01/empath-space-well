
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import OptimizedLoadingSpinner from "@/components/OptimizedLoadingSpinner";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const MoodTracker = lazy(() => import("./pages/MoodTracker"));
const Journal = lazy(() => import("./pages/Journal"));
const PersonalityQuiz = lazy(() => import("./pages/PersonalityQuiz"));
const CrisisSupport = lazy(() => import("./pages/CrisisSupport"));
const ResourceLibrary = lazy(() => import("./pages/ResourceLibrary"));
const MentalHealthGoals = lazy(() => import("./pages/MentalHealthGoals"));
const PeerSupport = lazy(() => import("./pages/PeerSupport"));
const Community = lazy(() => import("./pages/Community"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CreateBlogPost = lazy(() => import("./pages/CreateBlogPost"));
const EditBlogPost = lazy(() => import("./pages/EditBlogPost"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Settings = lazy(() => import("./pages/Settings"));
const Feedback = lazy(() => import("./pages/Feedback"));
const AppointmentBooking = lazy(() => import("./pages/AppointmentBooking"));
const GroupTherapy = lazy(() => import("./pages/GroupTherapy"));
const VoiceTherapy = lazy(() => import("./pages/VoiceTherapy"));
const DreamAnalysis = lazy(() => import("./pages/DreamAnalysis"));
const WellnessPlans = lazy(() => import("./pages/WellnessPlans"));
const MentalHealthInsights = lazy(() => import("./pages/MentalHealthInsights"));
const EmotionRecognition = lazy(() => import("./pages/EmotionRecognition"));
const PsychTests = lazy(() => import("./pages/PsychTests"));
const PsychTestRunner = lazy(() => import("./pages/PsychTestRunner"));
const TestResults = lazy(() => import("./pages/TestResults"));
const TestResultsPage = lazy(() => import("./pages/TestResultsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<OptimizedLoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/mood-tracker" element={<MoodTracker />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/quiz" element={<PersonalityQuiz />} />
                <Route path="/crisis-support" element={<CrisisSupport />} />
                <Route path="/resources" element={<ResourceLibrary />} />
                <Route path="/goals" element={<MentalHealthGoals />} />
                <Route path="/peer-support" element={<PeerSupport />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/:id" element={<PostDetail />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/create-blog" element={<CreateBlogPost />} />
                <Route path="/edit-blog/:id" element={<EditBlogPost />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/appointments" element={<AppointmentBooking />} />
                <Route path="/group-therapy" element={<GroupTherapy />} />
                <Route path="/voice-therapy" element={<VoiceTherapy />} />
                <Route path="/dream-analysis" element={<DreamAnalysis />} />
                <Route path="/wellness-plans" element={<WellnessPlans />} />
                <Route path="/insights" element={<MentalHealthInsights />} />
                <Route path="/emotion-recognition" element={<EmotionRecognition />} />
                <Route path="/psych-tests" element={<PsychTests />} />
                <Route path="/psych-tests/:testType" element={<PsychTestRunner />} />
                <Route path="/psych-tests/results" element={<TestResults />} />
                <Route path="/test-results" element={<TestResultsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
