import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { TherapistAuthProvider } from '@/context/TherapistAuthContext';
import SecurityMonitor from '@/components/SecurityMonitor';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import UserProfile from '@/pages/UserProfile';
import Community from '@/pages/Community';
import Blog from '@/pages/Blog';
import ResourceLibrary from '@/pages/ResourceLibrary';
import Feedback from '@/pages/Feedback';
import PsychTests from '@/pages/PsychTests';
import BlogPost from '@/pages/BlogPost';
import Journal from '@/pages/Journal';
import VoiceTherapy from '@/pages/VoiceTherapy';
import GroupTherapy from '@/pages/GroupTherapy';
import AdminDashboard from '@/pages/AdminDashboard';
import PsychTestRunner from '@/pages/PsychTestRunner';
import TestResults from '@/pages/TestResults';
import WellnessPlans from '@/pages/WellnessPlans';
import AppointmentBooking from '@/pages/AppointmentBooking';
import About from '@/pages/About';
import AIFeaturesMenu from '@/components/AIFeaturesMenu';
import MoodTracker from '@/pages/MoodTracker';
import CrisisSupport from '@/pages/CrisisSupport';
import DreamAnalysis from '@/pages/DreamAnalysis';
import EmotionRecognition from '@/pages/EmotionRecognition';
import MentalHealthGoals from '@/pages/MentalHealthGoals';
import MentalHealthInsights from '@/pages/MentalHealthInsights';
import PeerSupport from '@/pages/PeerSupport';
import TherapistDashboard from '@/pages/TherapistDashboard';

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
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/community" element={<Community />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:articleId" element={<BlogPost />} />
                <Route path="/resources" element={<ResourceLibrary />} />
                <Route path="/contact" element={<Feedback />} />
                <Route path="/tests" element={<PsychTests />} />
                <Route path="/psych-tests" element={<PsychTests />} />
                <Route path="/psych-tests/:testType" element={<PsychTestRunner />} />
                <Route path="/test-results" element={<TestResults />} />
                <Route path="/wellness-plans" element={<WellnessPlans />} />
                <Route path="/ai-journaling" element={<Journal />} />
                <Route path="/ai-therapy-chat" element={<VoiceTherapy />} />
                <Route path="/voice-therapy" element={<VoiceTherapy />} />
                <Route path="/group-therapy" element={<GroupTherapy />} />
                <Route path="/admin-panel" element={<AdminDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/ai-features" element={<AIFeaturesMenu />} />
                <Route path="/appointments" element={<AppointmentBooking />} />
                <Route path="/about" element={<About />} />
                
                {/* New routes for missing pages */}
                <Route path="/mood-tracker" element={<MoodTracker />} />
                <Route path="/crisis-support" element={<CrisisSupport />} />
                <Route path="/dream-analysis" element={<DreamAnalysis />} />
                <Route path="/emotion-recognition" element={<EmotionRecognition />} />
                <Route path="/mental-health-goals" element={<MentalHealthGoals />} />
                <Route path="/mental-health-insights" element={<MentalHealthInsights />} />
                <Route path="/peer-support" element={<PeerSupport />} />
                <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
              </Routes>
            </div>
          </Router>
        </TherapistAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;