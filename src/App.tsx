import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { TherapistAuthProvider } from '@/context/TherapistAuthContext';
import SecurityMonitor from '@/components/SecurityMonitor';
import LoadingSpinner from '@/components/LoadingSpinner';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import UserProfile from '@/pages/UserProfile';
import BlogPost from '@/pages/BlogPost';
import Journal from '@/pages/Journal';
import TestResults from '@/pages/TestResults';
import About from '@/pages/About';
import PersonalityQuiz from '@/pages/PersonalityQuiz';
import NotFound from '@/pages/NotFound';
import AIFeaturesMenu from '@/components/AIFeaturesMenu';
import MoodTracker from '@/pages/MoodTracker';
import CreateBlogPost from '@/pages/CreateBlogPost';
import EditBlogPost from '@/pages/EditBlogPost';
import CreatePost from '@/pages/CreatePost';
import PostDetail from '@/pages/PostDetail';
import TestResultsPage from '@/pages/TestResultsPage';
import CrisisSupport from '@/pages/CrisisSupport';
import DreamAnalysis from '@/pages/DreamAnalysis';
import EmotionRecognition from '@/pages/EmotionRecognition';
import MentalHealthGoals from '@/pages/MentalHealthGoals';
import MentalHealthInsights from '@/pages/MentalHealthInsights';
import PeerSupport from '@/pages/PeerSupport';
import TherapistProtected from '@/components/TherapistProtected';
import Settings from '@/pages/Settings';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Pricing from '@/pages/Pricing';
import Feedback from '@/pages/Feedback';
import ContactTeam from '@/pages/ContactTeam';

const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));

// Lazy load heavy components
import { 
  LazyAdminDashboard,
  LazyCommunity,
  LazyBlog,
  LazyResourceLibrary,
  LazyPsychTests,
  LazyPsychTestRunner,
  LazyVoiceTherapy,
  LazyGroupTherapy,
  LazyWellnessPlans,
  LazyAppointmentBooking,
  LazyTherapistDashboard,
  LazyGroupSession
} from '@/utils/lazyComponents';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TherapistAuthProvider>
          <SecurityMonitor />
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<Suspense fallback={<LoadingSpinner />}><ForgotPassword /></Suspense>} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/community" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Community..." />}>
                    <LazyCommunity />
                  </Suspense>
                } />
                <Route path="/community/create" element={<CreatePost />} />
                <Route path="/community/post/:postId" element={<PostDetail />} />
                <Route path="/blog" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Blog..." />}>
                    <LazyBlog />
                  </Suspense>
                } />
                <Route path="/blog/:articleId" element={<BlogPost />} />
                <Route path="/blog/create" element={<CreateBlogPost />} />
                <Route path="/blog/edit/:articleId" element={<EditBlogPost />} />
                <Route path="/resources" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Resources..." />}>
                    <LazyResourceLibrary />
                  </Suspense>
                } />
                <Route path="/contact" element={<Feedback />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/quiz" element={<PersonalityQuiz />} />
                <Route path="/tests" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Tests..." />}>
                    <LazyPsychTests />
                  </Suspense>
                } />
                <Route path="/psych-tests" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Tests..." />}>
                    <LazyPsychTests />
                  </Suspense>
                } />
                <Route path="/psych-tests/:testType" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Test..." />}>
                    <LazyPsychTestRunner />
                  </Suspense>
                } />
                <Route path="/test-results" element={<TestResults />} />
                <Route path="/test-results/:resultId" element={<TestResultsPage />} />
                <Route path="/wellness-plans" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Wellness Plans..." />}>
                    <LazyWellnessPlans />
                  </Suspense>
                } />
                <Route path="/journal" element={<Journal />} />
                <Route path="/ai-journaling" element={<Journal />} />
                <Route path="/ai-therapy-chat" element={
                  <Suspense fallback={<LoadingSpinner text="Loading AI Therapy..." />}>
                    <LazyVoiceTherapy />
                  </Suspense>
                } />
                <Route path="/voice-therapy" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Voice Therapy..." />}>
                    <LazyVoiceTherapy />
                  </Suspense>
                } />
                <Route path="/group-therapy" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Group Therapy..." />}>
                    <LazyGroupTherapy />
                  </Suspense>
                } />
                <Route path="/group-therapy/:roomId/session" element={
                  <Suspense fallback={<LoadingSpinner text="Joining Session..." />}>
                    <LazyGroupSession />
                  </Suspense>
                } />
                <Route path="/admin-panel" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Admin..." />}>
                    <LazyAdminDashboard />
                  </Suspense>
                } />
                <Route path="/ai-features" element={<AIFeaturesMenu />} />
                <Route path="/appointments" element={
                  <Suspense fallback={<LoadingSpinner text="Loading Appointments..." />}>
                    <LazyAppointmentBooking />
                  </Suspense>
                } />
                <Route path="/about" element={<About />} />
                
                {/* New routes for missing pages */}
                <Route path="/mood-tracker" element={<MoodTracker />} />
                <Route path="/crisis-support" element={<CrisisSupport />} />
                <Route path="/dream-analysis" element={<DreamAnalysis />} />
                <Route path="/emotion-recognition" element={<EmotionRecognition />} />
                <Route path="/mental-health-goals" element={<MentalHealthGoals />} />
                <Route path="/mental-health-insights" element={<MentalHealthInsights />} />
                <Route path="/peer-support" element={<PeerSupport />} />
                <Route 
                  path="/therapist-dashboard" 
                  element={
                    <TherapistProtected>
                      <Suspense fallback={<LoadingSpinner text="Loading Dashboard..." />}>
                        <LazyTherapistDashboard />
                      </Suspense>
                    </TherapistProtected>
                  } 
                />
                
                {/* Pages that were missing */}
                <Route path="/settings" element={<Settings />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact-team" element={<ContactTeam />} />
                {/* 404 - Must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </TherapistAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;